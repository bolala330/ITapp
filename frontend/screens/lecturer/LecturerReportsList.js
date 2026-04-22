import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function LecturerReportsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const user = auth.currentUser;
      const snap = await getDocs(collection(db, 'reports'));
      const reports = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Filter to show only this lecturer's reports
      const myReports = reports.filter(r => r.lecturerName === user.displayName || r.lecturerName === user.email);
      
      // Sort by newest
      myReports.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      
      setData(myReports);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reports</Text>
        <Text style={styles.headerSub}>History of submitted lectures</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.week}>Week {item.week}</Text>
            </View>
            <Text style={styles.topic}>{item.topic}</Text>
            <View style={styles.footer}>
              <Text style={styles.class}>{item.className}</Text>
              <View style={styles.attendance}>
                <Text style={styles.attLabel}>Attendance:</Text>
                <Text style={styles.attValue}>{item.studentsPresent}/{item.totalStudents}</Text>
              </View>
            </View>
            {item.prlFeedback && (
               <View style={styles.prlBox}>
                 <Text style={styles.prlLabel}>PRL Feedback:</Text>
                 <Text style={styles.prlText}>{item.prlFeedback}</Text>
               </View>
            )}
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  date: { fontSize: 14, fontWeight: '600', color: '#6366F1' },
  week: { fontSize: 12, color: '#94A3B8' },
  topic: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  class: { fontSize: 13, color: '#475569' },
  attendance: { flexDirection: 'row' },
  attLabel: { fontSize: 12, color: '#64748B', marginRight: 4 },
  attValue: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  prlBox: { marginTop: 10, padding: 10, backgroundColor: '#F0FDF4', borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#16A34A' },
  prlLabel: { fontSize: 11, fontWeight: '700', color: '#166534' },
  prlText: { fontSize: 12, color: '#14532D', marginTop: 2 }
});