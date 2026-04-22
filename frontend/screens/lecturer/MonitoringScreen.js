import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function MonitoringScreen() {
  const [stats, setStats] = useState({ totalLectures: 0, totalPresent: 0, totalRegistered: 0 });
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = async () => {
    try {
      const user = auth.currentUser;
      const snap = await getDocs(collection(db, 'reports'));
      const reports = snap.docs.map(d => d.data());
      
      const myReports = reports.filter(r => r.lecturerName === user.displayName || r.lecturerName === user.email);
      
      let totalL = 0;
      let totalP = 0;
      let totalR = 0;

      myReports.forEach(r => {
        totalL++;
        totalP += Number(r.studentsPresent || 0);
        totalR += Number(r.totalStudents || 0);
      });

      setStats({ totalLectures: totalL, totalPresent: totalP, totalRegistered: totalR });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const avgAttendance = stats.totalRegistered > 0 
    ? ((stats.totalPresent / stats.totalRegistered) * 100).toFixed(1) 
    : '0.0';

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D97706" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Monitoring</Text>
        <Text style={styles.headerSub}>Your teaching statistics</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statValue}>{avgAttendance}%</Text>
        <Text style={styles.statLabel}>Average Attendance</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.miniCard}>
          <Text style={styles.miniValue}>{stats.totalLectures}</Text>
          <Text style={styles.miniLabel}>Total Lectures</Text>
        </View>
        <View style={styles.miniCard}>
          <Text style={styles.miniValue}>{stats.totalPresent}</Text>
          <Text style={styles.miniLabel}>Total Attendances</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📈 Performance Insight</Text>
        <Text style={styles.infoText}>
          {avgAttendance >= 75 
            ? "Excellent engagement! Students are attending regularly." 
            : avgAttendance >= 50 
            ? "Attendance is average. Consider reviewing engagement strategies."
            : "Attendance is low. Review course content or check for scheduling conflicts."
          }
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  headerSub: { fontSize: 13, color: '#64748B' },
  statCard: { backgroundColor: '#D97706', margin: 20, borderRadius: 16, padding: 30, alignItems: 'center', shadowColor: '#D97706', shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 },
  statValue: { fontSize: 42, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 14, color: '#FEF3C7', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
  grid: { flexDirection: 'row', paddingHorizontal: 20, gap: 16, marginBottom: 20 },
  miniCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 14, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  miniValue: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  miniLabel: { fontSize: 12, color: '#64748B', marginTop: 4 },
  infoBox: { backgroundColor: '#FFFFFF', marginHorizontal: 20, marginBottom: 20, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FEF3C7' },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#D97706', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#475569', lineHeight: 20 }
});