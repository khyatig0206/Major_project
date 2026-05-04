import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Image,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { MODEL_LIST, PRIMARY_MODEL } from '../constants/models';
import { predictBloodGroup } from '../services/api';
import ResNetHeroCard from '../components/ResNetHeroCard';
import ModelCard from '../components/ModelCard';

export default function ResultScreen({ navigation, route }) {
  const { imageUri } = route.params;
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await predictBloodGroup(imageUri);
        setResults(data.results);
      } catch (e) {
        setError(e.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleScanAgain = () => navigation.popToTop();

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingLabel}>ANALYSING_</Text>
        <Text style={styles.loadingSubtext}>
          running {MODEL_LIST.length} models in parallel
        </Text>
      </View>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>CONNECTION ERROR — CHECK SERVER</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={handleScanAgain}>
          <Text style={styles.btnPrimaryText}>TRY AGAIN</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Build a lookup map: model key → result object
  const resultMap = {};
  results.forEach((r) => { resultMap[r.model] = r; });

  const primaryResult = resultMap[PRIMARY_MODEL.key];

  // Secondary models: everything except the primary
  const secondaryModels = MODEL_LIST.filter((m) => !m.primary);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderLabel}>ANALYSIS COMPLETE</Text>
        <Image
          source={{ uri: imageUri }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>
      <View style={styles.divider} />

      {/* ── ResNet hero result ──────────────────────────────────────────── */}
      <ResNetHeroCard
        result={primaryResult}
        accuracy={PRIMARY_MODEL.accuracy}
      />

      {/* ── Research models section ─────────────────────────────────────── */}
      <View style={styles.researchHeader}>
        <Text style={styles.researchTitle}>RESEARCH MODELS</Text>
        <Text style={styles.researchSub}>
          Supporting models shown for demonstration &amp; comparison purposes.
          Accuracy values reflect training results.
        </Text>
      </View>

      {secondaryModels.map((m) => {
        const result = resultMap[m.key];
        return (
          <ModelCard
            key={m.key}
            modelLabel={m.label}
            result={result}
            accuracy={m.accuracy}
            agreesWithConsensus={
              result?.available &&
              primaryResult?.available &&
              result.predicted_class === primaryResult.predicted_class
            }
          />
        );
      })}

      {/* ── Scan again ──────────────────────────────────────────────────── */}
      <TouchableOpacity style={styles.btnPrimary} onPress={handleScanAgain}>
        <Text style={styles.btnPrimaryText}>SCAN AGAIN</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 52,
    paddingBottom: SPACING.xl,
  },

  // ── Loading / Error centred screens ───────────────────────────────────────
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  loadingLabel: {
    fontFamily: FONTS.mono,
    fontSize: 22,
    color: COLORS.black,
    letterSpacing: 4,
    marginBottom: SPACING.sm,
  },
  loadingSubtext: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.grey,
    letterSpacing: 2,
  },
  errorText: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    color: COLORS.black,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  errorDetail: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },

  // ── Page header ───────────────────────────────────────────────────────────
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  pageHeaderLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.grey,
    letterSpacing: 3,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.black,
    marginBottom: SPACING.md,
  },

  // ── Research models section header ────────────────────────────────────────
  researchHeader: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.dimBorder,
  },
  researchTitle: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.grey,
    letterSpacing: 4,
    marginBottom: SPACING.xs,
  },
  researchSub: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.dimText,
    letterSpacing: 0.5,
    lineHeight: 14,
  },

  // ── Scan again button ─────────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: COLORS.black,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  btnPrimaryText: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    color: COLORS.white,
    letterSpacing: 4,
  },
});
