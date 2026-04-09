import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, StyleSheet,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function PreviewScreen({ navigation, route }) {
  const { imageUri } = route.params;
  const [analysing, setAnalysing] = useState(false);

  const handleAnalyse = () => {
    navigation.navigate('Result', { imageUri });
  };

  const handleRetake = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>PREVIEW</Text>
      <View style={styles.divider} />

      {/* Image preview */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <Text style={styles.readyText}>ready for analysis · 3 models available</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btnSecondary} onPress={handleRetake}>
          <Text style={styles.btnSecondaryText}>RETAKE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnPrimary} onPress={handleAnalyse}>
          <Text style={styles.btnPrimaryText}>ANALYSE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: 64,
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
  imageWrapper: {
    borderWidth: 1,
    borderColor: COLORS.black,
    alignSelf: 'center',
    marginBottom: SPACING.md,
    width: 280,
    height: 280,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  readyText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.grey,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  btnRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: 'auto',
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.black,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    color: COLORS.black,
    letterSpacing: 4,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    color: COLORS.white,
    letterSpacing: 4,
  },
});
