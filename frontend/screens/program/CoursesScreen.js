import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

export default function PLCoursesScreen() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://your-api.com/api/lecture-reports/courses')
      .then(res => { if (!res.ok) throw new Error('Network error'); return res.json(); })
      .then(data => { setCourses(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#4F46E5" />;
  if (error) return <Text style={styles.errorText}>Error loading courses: {error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList data={courses} keyExtractor={item => item.id.toString()} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title} <Text style={styles.code}>({item.code})</Text></Text>
            <Text style={styles.label}>Student Lecture Completion</Text>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: `${item.completion}%`, backgroundColor: item.completion === 100 ? '#10B981' : '#4F46E5' }]} />
            </View>
            <Text style={styles.percentage}>{item.completion}%</Text>
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
  title: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
  code: { fontSize: 13, color: '#9CA3AF', fontWeight: '700' },
  label: { fontSize: 13, color: '#6B7280', marginBottom: 8 },
  barBackground: { height: 10, backgroundColor: '#E5E7EB', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  percentage: { fontSize: 13, color: '#374151', fontWeight: '700', marginTop: 6, textAlign: 'right' }
});