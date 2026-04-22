import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function StudentLecturesScreen({ navigation }) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const q = query(collection(db, 'attendance'), orderBy('date', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLectures(data);
    } catch (e) {
      console.log("Error fetching lectures:", e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.courseBadge}>
          <Text style={styles.courseBadgeText}>{item.courseCode || 'N/A'}</Text>
        </View>
        <Text style={styles.dateText}>{item.date || 'No Date'}</Text>
      </View>

      <Text style={styles.topic}>{item.courseName}</Text>
      <Text style={styles.lecturerName}>by {item.lecturerName || 'Lecturer'}</Text>
      
      <TouchableOpacity 
        style={styles.rateBtn}
        // ✅ Updated to pass lecturerName
        onPress={() => navigation.navigate('RatingScreen', { 
          lectureId: item.id, 
          topic: item.courseName,
          courseCode: item.courseCode,
          lecturerName: item.lecturerName 
        })}
      >
        <Text style={styles.rateBtnText}>Rate This Lecture</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#0284C7" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lectures List</Text>
      <FlatList
        data={lectures}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No lectures posted yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#0F172A', padding: 20, paddingBottom: 10, backgroundColor: '#FFF' },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  courseBadge: { backgroundColor: '#E0F2FE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  courseBadgeText: { color: '#0369A1', fontWeight: 'bold', fontSize: 12 },
  dateText: { color: '#64748B', fontSize: 12, fontWeight: '600' },
  topic: { fontSize: 16, fontWeight: 'bold', color: '#334155', marginBottom: 8 },
  lecturerName: { color: '#64748B', fontSize: 12, marginBottom: 12 },
  rateBtn: { backgroundColor: '#0284C7', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  rateBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  empty: { textAlign: 'center', color: '#94A3B8', marginTop: 40 }
});