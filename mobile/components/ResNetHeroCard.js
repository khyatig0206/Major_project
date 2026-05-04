import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import TextBar from './TextBar';

/**
 * Large hero card shown at the top of results, reserved for the primary model (ResNet-50).
 *
 * Props:
 *   result   object  — API result for resnet (may be null / unavailable)
 *   accuracy number  — training accuracy from MODEL_LIST config
 */
export default function ResNetHeroCard({ result, accuracy }) {
  if (!result || !result.available) {
    return (
      <View style={styles.cardUnavailable}>
        <Text style={styles.unavailBadge}>PRIMARY MODEL</Text>
        <Text style={styles.unavailTitle}>RESNET-50</Text>
        <Text style={styles.unavailSub}>Model not loaded — check backend</Text>
      </View>
    );
  }

  const { predicted_class, confidence, all_probabilities } = result;

  const top4 = Object.entries(all_probabilities || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <View style={styles.card}>
      {/* Top badge row */}
      <View style={styles.badgeRow}>
        <View style={styles.primaryBadge}>
          <Text style={styles.primaryBadgeText}>★ PRIMARY MODEL</Text>
        </View>
        <View style={styles.accuracyBadge}>
          <Text style={styles.accuracyBadgeText}>
            TRAIN ACC {accuracy.toFixed(1)}%
          </Text>
        </View>
      </View>

      {/* Model name */}
      <Text style={styles.modelName}>RESNET-50</Text>

      {/* Big blood group */}
      <View style={styles.resultRow}>
        <Text style={styles.resultLabel}>PREDICTED BLOOD GROUP</Text>
        <Text style={styles.resultValue}>{predicted_class}</Text>
      </View>

      {/* Confidence */}
      <View style={styles.confSection}>
        <Text style={styles.confLabel}>CONFIDENCE</Text>
        <View style={styles.confBarRow}>
          <View style={styles.barFlex}>
            <TextBar value={confidence} maxValue={100} />
          </View>
          <Text style={styles.confValue}>{confidence.toFixed(2)}%</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Top-4 probabilities */}
      <Text style={styles.probTitle}>ALL CLASS PROBABILITIES</Text>
      {top4.map(([cls, prob]) => (
        <View key={cls} style={styles.probRow}>
          <Text style={styles.probCls}>{cls}</Text>
          <View style={styles.probBarWrap}>
            <TextBar value={prob} maxValue={100} compact />
          </View>
          <Text style={styles.probPct}>{prob.toFixed(1)}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.black,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },

  // Unavailable state
  cardUnavailable: {
    backgroundColor: COLORS.lightGrey,
    borderWidth: 2,
    borderColor: COLORS.black,
    borderStyle: 'dashed',
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  unavailBadge: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.grey,
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  unavailTitle: {
    fontFamily: FONTS.mono,
    fontSize: 18,
    color: COLORS.black,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: SPACING.xs,
  },
  unavailSub: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.grey,
    letterSpacing: 1,
  },

  // Badge row
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  primaryBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  primaryBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.black,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  accuracyBadge: {
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  accuracyBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.white,
    letterSpacing: 1,
  },

  // Model name
  modelName: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    color: COLORS.white,
    letterSpacing: 4,
    marginBottom: SPACING.md,
    opacity: 0.6,
  },

  // Blood group result
  resultRow: {
    marginBottom: SPACING.md,
  },
  resultLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.white,
    letterSpacing: 3,
    opacity: 0.5,
    marginBottom: SPACING.xs,
  },
  resultValue: {
    fontFamily: FONTS.mono,
    fontSize: 80,
    color: COLORS.white,
    fontWeight: 'bold',
    lineHeight: 88,
    letterSpacing: 4,
  },

  // Confidence
  confSection: {
    marginBottom: SPACING.sm,
  },
  confLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.white,
    letterSpacing: 3,
    opacity: 0.5,
    marginBottom: SPACING.xs,
  },
  confBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barFlex: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  confValue: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    color: COLORS.white,
    fontWeight: 'bold',
    minWidth: 55,
    textAlign: 'right',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.white,
    opacity: 0.15,
    marginVertical: SPACING.sm,
  },

  // Prob rows
  probTitle: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.white,
    letterSpacing: 3,
    opacity: 0.5,
    marginBottom: SPACING.sm,
  },
  probRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  probCls: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.white,
    width: 28,
    opacity: 0.85,
  },
  probBarWrap: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  probPct: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.white,
    width: 44,
    textAlign: 'right',
    opacity: 0.7,
  },
});
