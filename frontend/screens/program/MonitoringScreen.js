import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { BarChart } from 'react-native-chart-kit';

export default function PLMonitoringScreen() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://your-api.com/api/lecture-reports/analytics')
      .then(res => { if (!res.ok) throw new Error('Network error'); return res.json(); })
      .then(data => { 
        // Expects backend to return: { labels: ['CS-201', ...], grades: [75, 85, ...] }
        setChartData(data); 
        setLoading(false); 
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#4F46E5" />;
  if (error) return <Text style={styles.errorText}>Error loading chart: {error}</Text>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.headerTitle}>Student Grades from Lecture Reports</Text>
        
        {chartData && (
          <View style={styles.chartCard}>
            <BarChart
              data={{
                labels: chartData.labels,
                datasets: [{ data: chartData.grades }]
              }}
              width={340} height={220} yAxisLabel="%"
              chartConfig={{
                backgroundColor: '#FFFFFF', backgroundGradientFrom: '#FFFFFF', backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0, color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' }, center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { textAlign: 'center', marginTop: 50, color: 'red', fontSize: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginTop: 16, marginBottom: 12 },
  chartCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, elevation: 2, alignItems: 'center' }
});