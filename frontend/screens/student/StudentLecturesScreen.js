import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function StudentLecturesScreen() {
  const navigation = useNavigation();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      // Fetch all reports. 
      // TODO: Filter by specific course code if the student profile has 'enrolledCourses'
      // Example: where('courseCode', 'in', studentCourses)
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLectures(data);
    } catch (e) {
      console.log("Error fetching lectures:", e);
    } finally {
      setLoading(false);
    }
  };

  const renderLecture = ({ item }) => (
    <View style={styles.card}>
      {/* Header: Course and Date */}
      <View style={styles.cardHeader}>
        <View style={styles.courseBadge}>
          <Text style={styles.courseBadgeText}>{item.courseCode || 'N/A'}</Text>
        </View>
        <Text style={styles.dateText}>{item.date || 'No Date'}</Text>
      </View>

      {/* Body */}
      <Text style={styles.lecturerName}>by {item.lecturerName || 'Lecturer'}</Text>
      <Text style={styles.topic}>{item.topic}</Text>
      
      <Text style={styles.meta}>Week {item.week} • {item.venue}</Text>
      
      {/* Footer Actions */}
      <TouchableOpacity 
        style={styles.rateBtn}
        onPress={() => navigation.navigate('RatingScreen', { lectureId: item.id, topic: item.topic })}
      >
        <Text style={styles.rateBtnText}>Rate This Lecture</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#0284C7" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lectures & Reports</Text>
      <FlatList
        data={lectures}
        keyExtractor={item => item.id}
        renderItem={renderLecture}
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
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  courseBadge: { backgroundColor: '#E0F2FE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  courseBadgeText: { color: '#0369A1', fontWeight: 'bold', fontSize: 12 },
  dateText: { color: '#64748B', fontSize: 12, fontWeight: '600' },
  lecturerName: { color: '#64748B', fontSize: 12, marginBottom: 4, fontStyle: 'italic' },
  topic: { fontSize: 16, fontWeight: 'bold', color: '#334155', marginBottom: 8 },
  meta: { fontSize: 13, color: '#94A3B8', marginBottom: 12 },
  rateBtn: { backgroundColor: '#0284C7', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  rateBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  empty: { textAlign: 'center', color: '#94A3B8', marginTop: 40 }
});