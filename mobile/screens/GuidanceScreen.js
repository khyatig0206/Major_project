import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const STORAGE_KEY = '@bloodtype:guidance_dismissed';

export default function GuidanceScreen({ navigation }) {
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    // If already dismissed, skip straight to camera
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === 'true') navigation.replace('Camera');
    });
  }, []);

  const handleGotIt = async () => {
    if (dontShow) {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
    }
    navigation.replace('Camera');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>FINGERPRINT GUIDE</Text>
      <View style={styles.divider} />

      <View style={styles.steps}>
        <Text style={styles.step}>STEP 01 — APPLY INK TO FINGER</Text>
        <Text style={styles.step}>STEP 02 — PRESS FIRMLY ON WHITE PAPER</Text>
        <Text style={styles.step}>STEP 03 — PLACE PAPER FLAT UNDER CAMERA</Text>
      </View>

      <Text style={styles.note}>ensure good lighting · avoid shadows</Text>

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.btnPrimary} onPress={handleGotIt}>
        <Text style={styles.btnPrimaryText}>GOT IT — OPEN CAMERA</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dontShowBtn}
        onPress={() => setDontShow((v) => !v)}
      >
        <Text style={styles.dontShowText}>
          {dontShow ? '✓ don\'t show again' : 'don\'t show again'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: 72,
    paddingBottom: SPACING.xl,
  },
  heading: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    color: COLORS.black,
    letterSpacing: 4,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.black,
    marginVertical: SPACING.lg,
  },
  steps: {
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  step: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    color: COLORS.black,
    letterSpacing: 2,
    lineHeight: 22,
  },
  note: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.grey,
    letterSpacing: 1,
  },
  spacer: {
    flex: 1,
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
  dontShowBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  dontShowText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.grey,
    letterSpacing: 1,
  },
});
