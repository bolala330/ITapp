import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

const menuItems = [
  { title: 'Manage Courses', screen: 'PLCoursesScreen', emoji: '📘', desc: 'Assign Lecturers to Courses' },
  { title: 'Classes', screen: 'PLClassesScreen', emoji: '🏫', desc: 'View Class Groups' },
  { title: 'Lectures', screen: 'PLLecturesScreen', emoji: '🎤', desc: 'All Scheduled Lectures' },
  { title: 'Monitoring', screen: 'PLMonitoringScreen', emoji: '📊', desc: 'Attendance Analytics' },
  { title: 'Reports', screen: 'PLReportsScreen', emoji: '📋', desc: 'Lecturer Reports & Feedback' },
  { title: 'Ratings', screen: 'PLRatingScreen', emoji: '⭐', desc: 'Student Feedback Trends' },
];

export default function ProgramLeaderHome({ navigation }) {
  const auth = getAuth();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
            navigation.replace('LoginScreen'); 
          } catch (error) {
            console.error('Logout Error:', error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>Program Leader</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
           <Text style={styles.logoutBtn}>Logout ↪</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate(item.screen)} activeOpacity={0.7}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24, 
    backgroundColor: '#4F46E5', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30 
  },
  greeting: { fontSize: 16, color: '#C7D2FE' },
  userName: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', marginTop: 4 },
  logoutBtn: { color: '#E0E7FF', fontSize: 14, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 16, justifyContent: 'space-between' },
  card: { width: '47%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, minHeight: 120 },
  emoji: { fontSize: 32, marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937', textAlign: 'center' },
  cardDesc: { fontSize: 11, color: '#6B7280', textAlign: 'center', marginTop: 4 }
});