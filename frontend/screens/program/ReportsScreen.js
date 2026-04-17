import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

export default function PLReportsScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://your-api.com/api/lecture-reports/list')
      .then(res => { if (!res.ok) throw new Error('Network error'); return res.json(); })
      .then(data => { setReports(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#4F46E5" />;
  if (error) return <Text style={styles.errorText}>Error loading reports: {error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList data={reports} keyExtractor={item => item.id.toString()} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.details}>📝 By: {item.submittedBy} | 📅 {item.date}</Text>
            <View style={[styles.badge, { backgroundColor: item.status === 'Approved' ? '#D1FAE5' : '#FEF3C7', alignSelf: 'flex-start', marginTop: 12 }]}>
              <Text style={{ color: item.status === 'Approved' ? '#065F46' : '#92400E', fontSize: 12, fontWeight: '800' }}>
                {item.status === 'Approved' ? '✅' : '⏳'} {item.status}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' }, center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { textAlign: 'center', marginTop: 50, color: 'red', fontSize: 16 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, marginBottom: 16, elevation: 2 },
  title: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  details: { fontSize: 13, color: '#6B7280' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }
});