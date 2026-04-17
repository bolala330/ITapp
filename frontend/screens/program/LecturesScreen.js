import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

export default function PLLecturesScreen() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://your-api.com/api/lecture-reports')
      .then(res => { if (!res.ok) throw new Error('Network error'); return res.json(); })
      .then(data => { setLectures(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#4F46E5" />;
  if (error) return <Text style={styles.errorText}>Error loading lectures: {error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList data={lectures} keyExtractor={item => item.id.toString()} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.topic}>{item.topic}</Text>
            <Text style={styles.details}>🏫 {item.class} | 📅 {item.date}</Text>
            <View style={[styles.badge, { backgroundColor: item.status === 'Done' ? '#D1FAE5' : '#FEF3C7' }]}>
              <Text style={{ color: item.status === 'Done' ? '#065F46' : '#92400E', fontSize: 12, fontWeight: '800' }}>
                {item.status === 'Done' ? '✅ Completed' : '⏳ Pending'}
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
  topic: { fontSize: 17, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  details: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start' }
});