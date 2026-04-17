import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MonitoringScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Monitoring & Analytics</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Average Attendance Rate</Text>
        <Text style={styles.value}>85%</Text>
        <View style={styles.barBg}><View style={[styles.barFill, { width: '85%' }]} /></View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Reports Submitted</Text>
        <Text style={styles.value}>12</Text>
        <Text style={styles.sub}>This Semester</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Average Student Rating</Text>
        <Text style={styles.value}>4.5 / 5.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1E293B' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, marginBottom: 16, elevation: 2 },
  label: { fontSize: 14, color: '#64748B', marginBottom: 5 },
  value: { fontSize: 28, fontWeight: 'bold', color: '#0F172A' },
  sub: { fontSize: 12, color: '#94A3B8' },
  barBg: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, marginTop: 10 },
  barFill: { height: '100%', backgroundColor: '#059669', borderRadius: 4 }
});