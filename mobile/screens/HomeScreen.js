import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { MODEL_LIST } from '../constants/models';

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
        // Show all as unknown on error
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

  const loaded = loadedModels.filter((m) => m.available).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title */}
      <Text style={styles.title}>BLOODTYPE</Text>
      <Text style={styles.subtitle}>4-model fingerprint analysis</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Model tags */}
      <View style={styles.tagRow}>
        {loadedModels.map((m) => (
          <View
            key={m.key}
            style={[styles.tag, !m.available && styles.tagUnavailable]}
          >
            <Text style={[styles.tagText, !m.available && styles.tagTextUnavailable]}>
              {m.label}{!m.available ? ' —\nunavailable' : ''}
            </Text>
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
      <Text style={styles.footer}>8 classes · parallel inference</Text>
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
    letterSpacing: 2,
    marginTop: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.black,
    marginVertical: SPACING.lg,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  tag: {
    borderWidth: 1,
    borderColor: COLORS.black,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minWidth: 72,
    alignItems: 'center',
  },
  tagUnavailable: {
    borderColor: COLORS.grey,
  },
  tagText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.black,
    letterSpacing: 1,
    textAlign: 'center',
  },
  tagTextUnavailable: {
    color: COLORS.grey,
  },
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
  footer: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.grey,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});
