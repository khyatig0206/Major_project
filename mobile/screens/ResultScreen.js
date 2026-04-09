import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { MODEL_LIST } from '../constants/models';
import { predictBloodGroup } from '../services/api';
import { getConsensus } from '../utils/consensus';
import ModelCard from '../components/ModelCard';
import ConsensusBanner from '../components/ConsensusBanner';

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

  const handleScanAgain = () => {
    navigation.popToTop();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingLabel}>ANALYSING_</Text>
        <Text style={styles.loadingSubtext}>running 3 models in parallel</Text>
      </View>
    );
  }

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

  const consensus = getConsensus(results);
  const resultMap = {};
  results.forEach((r) => { resultMap[r.model] = r; });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>ANALYSIS COMPLETE</Text>
        <Image
          source={{ uri: imageUri }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>
      <View style={styles.divider} />

      {/* Consensus banner */}
      <ConsensusBanner consensus={consensus} />

      {/* Model cards */}
      {MODEL_LIST.map((m) => {
        const result = resultMap[m.key];
        const agrees =
          result?.available &&
          consensus.label !== 'NO CONSENSUS' &&
          consensus.label !== 'NO MODELS' &&
          result.predicted_class === consensus.label;

        return (
          <ModelCard
            key={m.key}
            modelLabel={m.label}
            result={result}
            agreesWithConsensus={agrees}
          />
        );
      })}

      {/* Scan again */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  headerLabel: {
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
