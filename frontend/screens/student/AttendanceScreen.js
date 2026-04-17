import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';

export default function AttendanceScreen() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        // TODO: If you have auth, add .where('studentId', '==', userId) here
        const snap = await getDocs(collection(db, 'studentAttendance'));
        const records = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAttendanceData(records);

        // Process data for the chart (Group by week/date and calculate %)
        const grouped = {};
        records.forEach(r => {
          const label = r.week ? `Week ${r.week}` : (r.date || 'Unknown');
          if (!grouped[label]) grouped[label] = { total: 0, present: 0 };
          grouped[label].total++;
          if (r.status === 'Present') grouped[label].present++;
        });

        const labels = Object.keys(grouped);
        const data = labels.map(k => Math.round((grouped[k].present / grouped[k].total) * 100));
        
        setChartData({ labels, data });
      } catch (e) {
        console.log('Error loading attendance:', e);
      } finally {
        setLoading(false);
      }
    };
    loadAttendance();
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#2563EB" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance Records</Text>
        <Text style={styles.headerSub}>Your lecture attendance overview</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Chart Section */}
        {chartData.labels.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Attendance Trend (%)</Text>
            <LineChart
              data={{ labels: chartData.labels, datasets: [{ data: chartData.data }] }}
              width={340} height={220} yAxisSuffix="%"
              chartConfig={{
                backgroundColor: '#FFFFFF', backgroundGradientFrom: '#FFFFFF', backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0, color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
        )}

        {/* List Section */}
        <Text style={styles.listTitle}>Detailed History</Text>
        {attendanceData.length === 0 ? (
          <Text style={styles.emptyText}>No attendance records found.</Text>
        ) : (
          attendanceData.map((record) => (
            <View key={record.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.courseName}>{record.courseName || 'Course'}</Text>
                <View style={[styles.statusBadge, { backgroundColor: record.status === 'Present' ? '#D1FAE5' : '#FEE2E2' }]}>
                  <Text style={{ color: record.status === 'Present' ? '#065F46' : '#991B1B', fontWeight: '700', fontSize: 12 }}>
                    {record.status === 'Present' ? '✅ Present' : '❌ Absent'}
                  </Text>
                </View>
              </View>
              <Text style={styles.details}>📅 {record.date} | 👤 {record.lecturerName || 'Lecturer'}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 3 },
  chartCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, elevation: 3, alignItems: 'center', marginBottom: 20 },
  chartTitle: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 10 },
  listTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 20 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 14, marginBottom: 12, elevation: 3 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  courseName: { fontSize: 15, fontWeight: '700', color: '#0F172A', flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  details: { fontSize: 13, color: '#64748B' }
});