const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * POST an image URI to /predict.
 * Returns the response JSON: { results: [...] }
 */
export const predictBloodGroup = async (imageUri) => {
  const formData = new FormData();

  // React Native FormData accepts { uri, name, type }
  const filename = imageUri.split('/').pop() || 'fingerprint.jpg';
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', bmp: 'image/bmp' };
  const type = mimeMap[ext] || 'image/jpeg';

  formData.append('file', {
    uri: imageUri,
    name: filename,
    type,
  });

  const response = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Server error ${response.status}: ${text}`);
  }

  return response.json();
};

/**
 * GET /health — returns loaded model status.
 */
export const getHealth = async () => {
  const response = await fetch(`${BASE_URL}/health`);
  if (!response.ok) throw new Error('Health check failed');
  return response.json();
};
