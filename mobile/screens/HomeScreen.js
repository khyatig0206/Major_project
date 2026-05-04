import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { MODEL_LIST, PRIMARY_MODEL } from '../constants/models';

export default function HomeScreen({ navigation }) {
  const [loadedModels, setLoadedModels] = useState([]);

  useEffect(() => {
    // Fetch which models are loaded from health endpoint
    const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${BASE_URL}/health`)
      .then((r) => r.json())
      .then((health) => {
        const loaded = MODEL_LIST.map((m) => ({
          ...m,
          available: health[m.key]?.loaded ?? false,
        }));
        setLoadedModels(loaded);
      })
      .catch(() => {
        setLoadedModels(MODEL_LIST.map((m) => ({ ...m, available: false })));
      });
  }, []);

  const handleCamera = () => navigation.navigate('Guidance');

  const handleUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission required to access photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      navigation.navigate('Preview', { imageUri: result.assets[0].uri });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title */}
      <Text style={styles.title}>BLOODTYPE</Text>
      <Text style={styles.subtitle}>fingerprint-based blood group detection</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Primary model highlight */}
      <View style={styles.primarySection}>
        <Text style={styles.primarySectionLabel}>★ PRIMARY MODEL</Text>
        <View style={styles.primaryTag}>
          <Text style={styles.primaryTagName}>{PRIMARY_MODEL.label}</Text>
          <Text style={styles.primaryTagAcc}>
            {PRIMARY_MODEL.accuracy.toFixed(1)}% TRAINING ACCURACY
          </Text>
        </View>
      </View>

      {/* Secondary models (research) */}
      <Text style={styles.researchLabel}>RESEARCH MODELS</Text>
      <View style={styles.tagRow}>
        {loadedModels
          .filter((m) => !m.primary)
          .map((m) => (
            <View
              key={m.key}
              style={[styles.tag, !m.available && styles.tagUnavailable]}
            >
              <Text style={[styles.tagText, !m.available && styles.tagTextUnavailable]}>
                {m.label}
              </Text>
              <Text style={styles.tagAcc}>{m.accuracy.toFixed(0)}% acc</Text>
              {!m.available && (
                <Text style={styles.tagUnavailText}>unavailable</Text>
              )}
            </View>
          ))}
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.btnPrimary} onPress={handleCamera}>
        <Text style={styles.btnPrimaryText}>OPEN CAMERA</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnPrimary} onPress={handleUpload}>
        <Text style={styles.btnPrimaryText}>UPLOAD IMAGE</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        8 blood groups · 4 models · ResNet-50 primary
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 64,
    paddingBottom: SPACING.xl,
  },
  title: {
    fontFamily: FONTS.mono,
    fontSize: 36,
    color: COLORS.black,
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  subtitle: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.grey,
    letterSpacing: 1,
    marginTop: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.black,
    marginVertical: SPACING.lg,
  },

  // Primary model block
  primarySection: {
    marginBottom: SPACING.lg,
  },
  primarySectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.black,
    letterSpacing: 3,
    marginBottom: SPACING.xs,
  },
  primaryTag: {
    backgroundColor: COLORS.black,
    padding: SPACING.md,
  },
  primaryTagName: {
    fontFamily: FONTS.mono,
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  primaryTagAcc: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.white,
    letterSpacing: 2,
    opacity: 0.6,
    marginTop: 4,
  },

  // Research models
  researchLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.grey,
    letterSpacing: 3,
    marginBottom: SPACING.sm,
    opacity: 0.7,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  tag: {
    borderWidth: 1,
    borderColor: COLORS.dimBorder,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minWidth: 80,
    alignItems: 'center',
    opacity: 0.65,
  },
  tagUnavailable: {
    borderColor: COLORS.dimBorder,
    opacity: 0.4,
  },
  tagText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.grey,
    letterSpacing: 1,
    textAlign: 'center',
  },
  tagTextUnavailable: {
    color: COLORS.dimText,
  },
  tagAcc: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.dimText,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  tagUnavailText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.dimText,
    letterSpacing: 1,
    marginTop: 2,
  },

  // Buttons
  btnPrimary: {
    backgroundColor: COLORS.black,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  btnPrimaryText: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    color: COLORS.white,
    letterSpacing: 4,
  },

  // Footer
  footer: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.grey,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});
