import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
// 1. IMPORT YOUR FIREBASE DB
import { db } from '../../services/firebase'; 
import { collection, getDocs } from 'firebase/firestore';

export default function PLMonitoringScreen() {
  const [stats, setStats] = useState({ attendance: 0, total: 0, present: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = async () => {
    try {
      // 2. FETCH FROM 'attendance' COLLECTION
      const snap = await getDocs(collection(db, 'attendance'));
      const attendanceDocs = snap.docs.map(doc => doc.data());

      let totalRecords = 0;
      let presentRecords = 0;

      // 3. CHECK STATUS FIELD
      attendanceDocs.forEach(doc => {
        totalRecords++;
        // Assuming status is string "Present" as seen in your image
        if (doc.status && doc.status.toLowerCase() === 'present') {
          presentRecords++;
        }
      });

      const percentage = totalRecords > 0 ? ((presentRecords / totalRecords) * 100).toFixed(1) : 0;

      setStats({ attendance: percentage, total: totalRecords, present: presentRecords });
    } catch (e) {
      console.log("Error calculating stats:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#4F46E5" />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Monitoring</Text>
        <Text style={styles.headerSub}>Live Data from 'attendance' collection</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.bigNumber}>{stats.attendance}%</Text>
        <Text style={styles.label}>Overall Attendance Rate</Text>
        
        <View style={styles.barContainer}>
          <View style={[styles.barFill, { width: `${stats.attendance}%` }]} />
        </View>
        <Text style={styles.subLabel}>{stats.present} Present out of {stats.total} Total Records</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.miniCard}>
          <Text style={styles.miniNumber}>{stats.total}</Text>
          <Text style={styles.miniLabel}>Total Records</Text>
        </View>
        <View style={styles.miniCard}>
          <Text style={styles.miniNumber}>{stats.present}</Text>
          <Text style={styles.miniLabel}>Present</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  headerSub: { fontSize: 13, color: '#6B7280' },
  statCard: { backgroundColor: '#4F46E5', margin: 20, borderRadius: 16, padding: 24, alignItems: 'center', elevation: 4 },
  bigNumber: { fontSize: 48, fontWeight: '800', color: '#FFFFFF' },
  label: { fontSize: 14, color: '#C7D2FE', marginTop: 4, textTransform: 'uppercase' },
  subLabel: { fontSize: 12, color: '#FFFFFF', marginTop: 8 },
  barContainer: { width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, marginTop: 20, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#34D399', borderRadius: 4 },
  grid: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  miniCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, alignItems: 'center', elevation: 2 },
  miniNumber: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
  miniLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 }
});