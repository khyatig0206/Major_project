import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Reticle: landscape-oriented to frame a paper fingerprint
const RETICLE_W = SCREEN_W * 0.78;
const RETICLE_H = RETICLE_W * 0.55;

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, []);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permText}>CAMERA PERMISSION REQUIRED</Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={requestPermission}>
          <Text style={styles.btnText}>GRANT PERMISSION</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      navigation.navigate('Preview', { imageUri: photo.uri });
    } catch (e) {
      console.warn('Capture error', e);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* Reticle overlay */}
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.reticle}>
          <Text style={styles.reticleLabel}>ALIGN FINGERPRINT</Text>
        </View>
        <Text style={styles.hint}>
          stamp inked finger on white paper · place flat · capture
        </Text>
      </View>

      {/* Capture button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.captureBtn, capturing && styles.captureBtnDisabled]}
          onPress={handleCapture}
          disabled={capturing}
        >
          <Text style={styles.captureBtnText}>
            {capturing ? 'CAPTURING...' : 'CAPTURE'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  permText: {
    fontFamily: FONTS.mono,
    color: COLORS.white,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 80,
    letterSpacing: 2,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: SPACING.lg,
    zIndex: 10,
  },
  backText: {
    color: COLORS.white,
    fontSize: 24,
    fontFamily: FONTS.mono,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticle: {
    width: RETICLE_W,
    height: RETICLE_H,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 6,
  },
  reticleLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.white,
    letterSpacing: 3,
    opacity: 0.85,
  },
  hint: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.grey,
    letterSpacing: 1,
    marginTop: SPACING.md,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  bottomBar: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureBtn: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl * 2,
  },
  captureBtnDisabled: {
    opacity: 0.5,
  },
  captureBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    color: COLORS.black,
    letterSpacing: 4,
  },
  btnPrimary: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  btnText: {
    fontFamily: FONTS.mono,
    color: COLORS.black,
    letterSpacing: 2,
    fontSize: 12,
  },
});
