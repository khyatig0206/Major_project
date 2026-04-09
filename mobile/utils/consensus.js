/**
 * Compute consensus from an array of model result objects.
 * Only considers results where available === true.
 *
 * Returns:
 *   { label: "A+", count: 3, total: 3 }     — all agree
 *   { label: "B+", count: 2, total: 3 }     — majority
 *   { label: "NO CONSENSUS", count: 1, total: 3 } — all differ / even split
 */
export const getConsensus = (results) => {
  const available = results.filter((r) => r.available);
  const total = available.length;

  if (total === 0) {
    return { label: 'NO MODELS', count: 0, total: 0 };
  }

  const counts = {};
  available.forEach((r) => {
    counts[r.predicted_class] = (counts[r.predicted_class] || 0) + 1;
  });

  const max = Math.max(...Object.values(counts));

  if (max === 1 && total > 1) {
    return { label: 'NO CONSENSUS', count: 1, total };
  }

  const label = Object.keys(counts).find((k) => counts[k] === max);
  return { label, count: max, total };
};
