import os
import io
import threading
import numpy as np
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Optional

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from PIL import Image
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.imagenet_utils import preprocess_input

# ─────────────────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────────────────

MODEL_PATHS = {
    "lenet":   os.getenv("LENET_PATH",   "code/Lenet/model_blood_group_detection_lenet.h5"),
    "resnet":  os.getenv("RESNET_PATH",  "code/Resnet34/model_blood_group_detection_resnet.h5"),
    "vgg16":   os.getenv("VGG16_PATH",   "code/Vgg16/model_blood_group_detection_vgg.h5"),
    "alexnet": os.getenv("ALEXNET_PATH", "code/Alexnet/model_blood_group_detection_alexnet.h5"),
}

CLASS_LABELS = {
    0: "A+", 1: "A-", 2: "AB+", 3: "AB-",
    4: "B+", 5: "B-", 6: "O+",  7: "O-"
}

# ─────────────────────────────────────────────────────────────────────────────
# Model loading at startup
# ─────────────────────────────────────────────────────────────────────────────

loaded_models: dict = {}
model_load_status: dict = {}

def load_all_models():
    for model_name, path in MODEL_PATHS.items():
        if path is None:
            print(f"[SKIP] {model_name}: path is None")
            model_load_status[model_name] = {"loaded": False, "path": None}
            continue
        if not os.path.isfile(path):
            print(f"[SKIP] {model_name}: file not found at '{path}'")
            model_load_status[model_name] = {"loaded": False, "path": path}
            continue
        try:
            print(f"[LOAD] {model_name}: loading from '{path}' …")
            model = tf.keras.models.load_model(path)
            # Read the spatial input size the model was trained on (H, W)
            _, h, w, _ = model.input_shape
            loaded_models[model_name] = {"model": model, "input_size": (h, w)}
            model_load_status[model_name] = {"loaded": True, "path": path}
            print(f"[OK]   {model_name}: loaded — input size {h}×{w}")
        except Exception as exc:
            print(f"[ERROR] {model_name}: failed to load — {exc}")
            model_load_status[model_name] = {"loaded": False, "path": path}


load_all_models()

# TF 2.4 is not thread-safe for concurrent model.predict() calls.
# Serialise all inference with a global lock.
_tf_lock = threading.Lock()

# ─────────────────────────────────────────────────────────────────────────────
# App
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(title="Blood Group Detection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Preprocessing
# ─────────────────────────────────────────────────────────────────────────────

def preprocess_image(image_bytes: bytes, input_size: tuple = (224, 224)) -> np.ndarray:
    """
    1. PIL open → RGB
    2. Resize to input_size (model-specific)
    3. img_to_array
    4. expand_dims(axis=0)
    5. preprocess_input (ImageNet)
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(input_size)          # (W, H) — PIL uses width-first
    arr = img_to_array(img)
    arr = np.expand_dims(arr, axis=0)
    arr = preprocess_input(arr)
    return arr


def run_single_model(model_name: str, model_entry: dict, image_bytes: bytes) -> dict:
    """Run one model and return structured result dict.
    model_entry = {"model": ..., "input_size": (H, W)}
    Preprocessing happens inside the thread using the model's own input size.
    The global _tf_lock serialises predict() calls for TF 2.4 thread safety.
    """
    model = model_entry["model"]
    h, w   = model_entry["input_size"]
    # Each thread preprocesses independently — no shared array
    arr = preprocess_image(image_bytes, input_size=(w, h))  # PIL resize: (W, H)
    with _tf_lock:
        preds = model.predict(arr, verbose=0)[0]   # shape: (8,)
    class_idx = int(np.argmax(preds))
    predicted_class = CLASS_LABELS[class_idx]
    confidence = float(round(preds[class_idx] * 100, 2))
    all_probabilities = {
        CLASS_LABELS[i]: float(round(float(preds[i]) * 100, 2))
        for i in range(len(CLASS_LABELS))
    }
    return {
        "model": model_name,
        "available": True,
        "predicted_class": predicted_class,
        "confidence": confidence,
        "all_probabilities": all_probabilities,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return model_load_status


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ("image/jpeg", "image/png", "image/bmp",
                                  "image/jpg", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="Unsupported image format")

    image_bytes = await file.read()

    # Build unavailable stubs for models that are not loaded
    results_map: dict = {}
    for model_name in MODEL_PATHS:
        if model_name not in loaded_models:
            results_map[model_name] = {
                "model": model_name,
                "available": False,
                "predicted_class": None,
                "confidence": None,
                "all_probabilities": None,
            }

    # Run all loaded models — each preprocesses for its own input size
    if loaded_models:
        with ThreadPoolExecutor() as executor:
            future_to_name = {
                executor.submit(run_single_model, name, entry, image_bytes): name
                for name, entry in loaded_models.items()
            }
            for future in as_completed(future_to_name):
                name = future_to_name[future]
                try:
                    results_map[name] = future.result()
                except Exception as exc:
                    # Log the real error so it's visible in the server console
                    print(f"[PREDICT ERROR] {name}: {type(exc).__name__}: {exc}")
                    results_map[name] = {
                        "model": name,
                        "available": False,
                        "predicted_class": None,
                        "confidence": None,
                        "all_probabilities": None,
                    }

    # Return in fixed order: lenet, resnet, vgg16, alexnet
    ordered_results = [results_map[name] for name in ["lenet", "resnet", "vgg16", "alexnet"]]
    return JSONResponse(content={"results": ordered_results})
