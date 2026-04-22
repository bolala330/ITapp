import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function ClassesScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const user = auth.currentUser;
      const snap = await getDocs(collection(db, 'reports'));
      const reports = snap.docs.map(d => d.data());
      
      // Filter reports where lecturerName matches current user
      // Or if reports are linked to courses, we check the course assignment
      const myReports = reports.filter(r => r.lecturerName === user.displayName || r.lecturerName === user.email);
      
      const grouped = {};
      myReports.forEach(r => {
        if (!r.className) return;
        if (!grouped[r.className]) {
          grouped[r.className] = {
            className: r.className,
            courseName: r.courseName || 'N/A',
            courseCode: r.courseCode || 'N/A',
            totalLectures: 1,
          };
        } else {
          grouped[r.className].totalLectures++;
        }
      });

      setData(Object.values(grouped));
    } catch (e) {
      console.log('Error loading classes:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Classes</Text>
        <Text style={styles.headerSub}>Classes you are teaching</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, i) => i.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconBox}>
              <Text style={styles.iconEmoji}>📚</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.className}>{item.className}</Text>
              <Text style={styles.course}>{item.courseName} ({item.courseCode})</Text>
              <Text style={styles.stats}>{item.totalLectures} lectures conducted</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  headerSub: { fontSize: 13, color: '#64748B' },
  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconEmoji: { fontSize: 20 },
  info: { flex: 1, justifyContent: 'center' },
  className: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  course: { fontSize: 13, color: '#64748B', marginTop: 2 },
  stats: { fontSize: 12, color: '#94A3B8', marginTop: 4 }
});