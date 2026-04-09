import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

/**
 * Full-width black consensus banner.
 * Props:
 *   consensus  { label, count, total }
 */
export default function ConsensusBanner({ consensus }) {
  const { label, count, total } = consensus;

  const isNoConsensus = label === 'NO CONSENSUS' || label === 'NO MODELS';

  let subText = '';
  if (isNoConsensus) {
    subText = 'NO CONSENSUS — review below';
  } else if (count === total) {
    subText = `${count} of ${total} models agree`;
  } else {
    subText = `${count} of ${total} models agree`;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerLabel}>CONSENSUS</Text>
      <Text style={[styles.bannerResult, isNoConsensus && styles.bannerResultSmall]}>
        {isNoConsensus ? '—' : label}
      </Text>
      <Text style={styles.bannerSub}>{subText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.black,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bannerLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.white,
    letterSpacing: 4,
    marginBottom: SPACING.xs,
  },
  bannerResult: {
    fontFamily: FONTS.mono,
    fontSize: 72,
    color: COLORS.white,
    fontWeight: 'bold',
    lineHeight: 80,
  },
  bannerResultSmall: {
    fontSize: 48,
    lineHeight: 56,
  },
  bannerSub: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.grey,
    letterSpacing: 1,
    marginTop: SPACING.xs,
  },
});
