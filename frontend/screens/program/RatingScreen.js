import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit';

export default function PLRatingScreen() {
  const [ratingsHistory, setRatingsHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('https://your-api.com/api/lecture-reports/ratings')
      .then(res => { if (!res.ok) throw new Error('Network error'); return res.json(); })
      .then(data => { 
        // Expects backend: { labels: ['Week 1', ...], scores: [3.5, 4.0, ...] }
        setRatingsHistory(data); 
        setLoading(false); 
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#4F46E5" />;
  if (error) return <Text style={styles.errorText}>Error loading ratings: {error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Lecture Rating Trends</Text>
      
      {ratingsHistory && (
        <View style={styles.chartCard}>
          <LineChart
            data={{ labels: ratingsHistory.labels, datasets: [{ data: ratingsHistory.scores }] }}
            width={340} height={220} yAxisSuffix="/5"
            chartConfig={{
              backgroundColor: '#FFFFFF', backgroundGradientFrom: '#FFFFFF', backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 1, color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>
      )}

      <Text style={styles.headerTitle}>Manually Rate Latest Lecture</Text>
      <View style={styles.ratingCard}>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => { setSelectedRating(star); setSubmitted(false); }}>
              <Text style={styles.starEmoji}>{star <= selectedRating ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.submitBtn, selectedRating === 0 && styles.disabledBtn]} onPress={() => selectedRating > 0 && setSubmitted(true)} disabled={selectedRating === 0}>
          <Text style={styles.submitText}>Submit Rating</Text>
        </TouchableOpacity>
        {submitted && <Text style={styles.successText}>✅ Rated {selectedRating}/5 successfully!</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 }, center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { textAlign: 'center', marginTop: 50, color: 'red', fontSize: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginTop: 16, marginBottom: 12 },
  chartCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, elevation: 2, alignItems: 'center' },
  ratingCard: { backgroundColor: '#FFF', padding: 24, borderRadius: 16, elevation: 2, alignItems: 'center' },
  starsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  starEmoji: { fontSize: 40 },
  submitBtn: { backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 12 },
  disabledBtn: { backgroundColor: '#D1D5DB' },
  submitText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  successText: { color: '#059669', fontWeight: '700', marginTop: 16, fontSize: 14 }
});