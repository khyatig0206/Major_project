import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

const FILLED_CHAR = '█';
const EMPTY_CHAR  = '░';
const BAR_TOTAL   = 20;  // full bar length in characters
const COMPACT_TOTAL = 10;

/**
 * ASCII probability bar.
 * Props:
 *   value     number  (0–100)
 *   maxValue  number  (usually 100)
 *   compact   bool    (shorter bar for prob rows)
 */
export default function TextBar({ value, maxValue = 100, compact = false }) {
  const total = compact ? COMPACT_TOTAL : BAR_TOTAL;
  const filled = Math.round((value / maxValue) * total);
  const empty  = total - filled;

  const bar = FILLED_CHAR.repeat(Math.max(0, filled)) + EMPTY_CHAR.repeat(Math.max(0, empty));

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.bar, compact && styles.barCompact]}>{bar}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  bar: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: COLORS.black,
    letterSpacing: 0,
  },
  barCompact: {
    fontSize: 10,
  },
});
