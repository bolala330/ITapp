import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

export default function LecturerHome() {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user?.displayName || 'Lecturer'}</Text>
        <Text style={styles.role}>Faculty Member</Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ClassesScreen')}>
          <Text style={styles.emoji}>📚</Text>
          <Text style={styles.label}>My Classes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('LecturerReportForm')}>
          <Text style={styles.emoji}>📝</Text>
          <Text style={styles.label}>New Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('LecturerReportsList')}>
          <Text style={styles.emoji}>📂</Text>
          <Text style={styles.label}>My Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MonitoringScreen')}>
          <Text style={styles.emoji}>📊</Text>
          <Text style={styles.label}>Monitoring</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('LecturerRatingScreen')}>
          <Text style={styles.emoji}>⭐</Text>
          <Text style={styles.label}>My Ratings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 24, backgroundColor: '#FFF', marginBottom: 20 },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  role: { fontSize: 14, color: '#64748B', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, justifyContent: 'space-between' },
  card: { 
    width: '48%', 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 16, 
    alignItems: 'center', 
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  emoji: { fontSize: 32, marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155' }
});