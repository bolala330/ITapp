import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function PLLecturesScreen() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = async () => {
    try {
      const snap = await getDocs(collection(db, 'reports'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLectures(list);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#4F46E5" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lectures</Text>
        <Text style={styles.headerSub}>Submitted by Lecturers</Text>
      </View>
      <FlatList
        data={lectures}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.topic}>{item.topic}</Text>
            <Text style={styles.details}>📅 {item.date} • 🏫 {item.className}</Text>
            <Text style={styles.lecturer}>👨‍🏫 {item.lecturerName}</Text>
            <View style={[styles.badge, { backgroundColor: '#D1FAE5' }]}>
              <Text style={styles.badgeText}>Report Submitted</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  headerSub: { fontSize: 13, color: '#6B7280' },
  list: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  topic: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 6 },
  details: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  lecturer: { fontSize: 12, color: '#4F46E5', fontWeight: '600', marginBottom: 10 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#065F46' }
});