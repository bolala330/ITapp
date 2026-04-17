import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

export default function PLClassesScreen() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://your-api.com/api/lecture-reports/classes')
      .then(res => { if (!res.ok) throw new Error('Network error'); return res.json(); })
      .then(data => { setClasses(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#4F46E5" />;
  if (error) return <Text style={styles.errorText}>Error loading classes: {error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList data={classes} keyExtractor={item => item.id.toString()} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.className}>{item.name}</Text>
            <Text style={styles.stat}>👨‍🎓 Students: {item.students} | 📊 Avg Grade: {item.avgGrade}</Text>
            <Text style={styles.instructor}>👨‍🏫 {item.instructor}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' }, center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { textAlign: 'center', marginTop: 50, color: 'red', fontSize: 16 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, marginBottom: 16, elevation: 2, borderLeftWidth: 6, borderLeftColor: '#10B981' },
  className: { fontSize: 17, fontWeight: '700', color: '#1F2937', marginBottom: 10 },
  stat: { fontSize: 14, color: '#6B7280', fontWeight: '600', marginBottom: 6 },
  instructor: { fontSize: 13, color: '#4F46E5', fontWeight: '700' }
});