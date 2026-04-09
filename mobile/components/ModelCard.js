import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import TextBar from './TextBar';

/**
 * Single model result card.
 * Props:
 *   modelLabel   string  — e.g. "LENET"
 *   result       object  — API result object (or null if unavailable)
 *   agreesWithConsensus bool
 */
export default function ModelCard({ modelLabel, result, agreesWithConsensus }) {
  // Unavailable card
  if (!result || !result.available) {
    return (
      <View style={styles.cardUnavailable}>
        <Text style={styles.unavailableText}>
          {modelLabel} — model unavailable
        </Text>
      </View>
    );
  }

  const { predicted_class, confidence, all_probabilities } = result;

  // Sort top 3 classes by probability
  const top3 = Object.entries(all_probabilities || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const leftBorderStyle = agreesWithConsensus
    ? { borderLeftWidth: 4, borderLeftColor: COLORS.black }
    : { borderLeftWidth: 1, borderLeftColor: COLORS.grey };

  return (
    <View style={[styles.card, leftBorderStyle]}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.modelName}>{modelLabel}</Text>
        <Text style={styles.predictedBadge}>{predicted_class}</Text>
      </View>

      {/* Overall confidence bar */}
      <View style={styles.overallBar}>
        <TextBar value={confidence} maxValue={100} />
        <Text style={styles.confText}>{confidence.toFixed(2)}%</Text>
      </View>

      {/* Top 3 probabilities */}
      {top3.map(([cls, prob]) => (
        <View key={cls} style={styles.probRow}>
          <Text style={styles.classLabel}>{cls}</Text>
          <View style={styles.barWrapper}>
            <TextBar value={prob} maxValue={100} compact />
          </View>
          <Text style={styles.probText}>{prob.toFixed(1)}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.black,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardUnavailable: {
    backgroundColor: COLORS.lightGrey,
    borderWidth: 1,
    borderColor: COLORS.grey,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  unavailableText: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: COLORS.grey,
    letterSpacing: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  modelName: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: COLORS.black,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  predictedBadge: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    color: COLORS.black,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: COLORS.black,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  overallBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  confText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.grey,
    marginLeft: SPACING.sm,
    minWidth: 50,
    textAlign: 'right',
  },
  probRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  classLabel: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.black,
    width: 28,
  },
  barWrapper: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  probText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.grey,
    width: 40,
    textAlign: 'right',
  },
});
