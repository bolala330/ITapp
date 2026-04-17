import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, getAuth } from 'firebase/firestore';

export default function LecturerRatingScreen() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    // Assuming you have a 'ratings' collection where 'lecturerId' matches
    const auth = getAuth();
    const q = query(collection(db, 'ratings'), where('lecturerId', '==', auth.currentUser.uid));
    const snap = await getDocs(q);
    
    // Fallback dummy data if collection is empty or for testing
    const data = snap.empty ? [
      { id: 1, student: 'Alice Johnson', rating: 5, comment: 'Great explanation!' },
      { id: 2, student: 'Bob Smith', rating: 4, comment: 'Good class, but fast pace.' },
    ] : snap.docs.map(d => ({ id: d.id, ...d.data() }));

    setRatings(data);
    setLoading(false);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#059669" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student Feedback</Text>
      <FlatList
        data={ratings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.student}>{item.student}</Text>
              <Text style={styles.stars}>{'⭐'.repeat(item.rating)}</Text>
            </View>
            <Text style={styles.comment}>{item.comment}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1E293B' },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  student: { fontWeight: 'bold', color: '#334155' },
  stars: { fontSize: 14 },
  comment: { color: '#64748B', fontStyle: 'italic' },
  center: { flex: 1, justifyContent: 'center' }
});