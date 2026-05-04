import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import TextBar from './TextBar';

/**
 * Secondary model result card (research / demonstration purposes).
 * Rendered in a visually muted / faded style to clearly communicate these
 * are supporting-evidence models, not the primary result.
 *
 * Props:
 *   modelLabel          string   — e.g. "LENET-5"
 *   result              object   — API result object (or null/unavailable)
 *   accuracy            number   — training accuracy from config
 *   agreesWithConsensus bool
 */
export default function ModelCard({ modelLabel, result, accuracy, agreesWithConsensus }) {
  // ── Unavailable ───────────────────────────────────────────────────────────
  if (!result || !result.available) {
    return (
      <View style={styles.cardUnavailable}>
        <Text style={styles.unavailLabel}>{modelLabel}</Text>
        <Text style={styles.unavailSub}>model unavailable</Text>
      </View>
    );
  }

  const { predicted_class, confidence, all_probabilities } = result;

  const top3 = Object.entries(all_probabilities || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.nameRow}>
          <Text style={styles.modelName}>{modelLabel}</Text>
          {typeof accuracy === 'number' && (
            <View style={styles.accBadge}>
              <Text style={styles.accBadgeText}>
                {accuracy.toFixed(1)}% ACC
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.predictedBadge}>{predicted_class}</Text>
      </View>

      {/* Confidence */}
      <View style={styles.confRow}>
        <View style={styles.confBarWrap}>
          <TextBar value={confidence} maxValue={100} />
        </View>
        <Text style={styles.confText}>{confidence.toFixed(1)}%</Text>
      </View>

      {/* Top-3 probabilities */}
      {top3.map(([cls, prob]) => (
        <View key={cls} style={styles.probRow}>
          <Text style={styles.classLabel}>{cls}</Text>
          <View style={styles.probBarWrap}>
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
    backgroundColor: COLORS.dimBg,
    borderWidth: 1,
    borderColor: COLORS.dimBorder,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    opacity: 0.75,          // visually faded — these are research models
  },
  cardUnavailable: {
    backgroundColor: COLORS.dimBg,
    borderWidth: 1,
    borderColor: COLORS.dimBorder,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    opacity: 0.5,
  },
  unavailLabel: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.dimText,
    letterSpacing: 2,
  },
  unavailSub: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.dimText,
    letterSpacing: 1,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  modelName: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.grey,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  accBadge: {
    borderWidth: 1,
    borderColor: COLORS.dimBorder,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  accBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.dimText,
    letterSpacing: 1,
  },
  predictedBadge: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    color: COLORS.grey,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: COLORS.dimBorder,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },

  // Confidence bar
  confRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  confBarWrap: {
    flex: 1,
    marginRight: SPACING.xs,
  },
  confText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.dimText,
    minWidth: 44,
    textAlign: 'right',
  },

  // Prob rows
  probRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  classLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.dimText,
    width: 28,
  },
  probBarWrap: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  probText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.dimText,
    width: 38,
    textAlign: 'right',
  },
});
