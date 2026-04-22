import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

const menuItems = [
  { title: 'Academic Monitoring', screen: 'StudentMonitoringScreen', emoji: '📈', desc: 'Dashboard & Sign Attendance' },
  { title: 'View Lectures', screen: 'StudentLecturesScreen', emoji: '📚', desc: 'Upcoming & Past Lectures' },
  { title: 'My Attendance', screen: 'AttendanceScreen', emoji: '📊', desc: 'History & Charts' },
  { title: 'Rate Lecturer', screen: 'RatingScreen', emoji: '⭐', desc: 'Provide Feedback' },
];

export default function StudentHome({ navigation }) {
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
          <Text style={styles.greeting}>Welcome,</Text>
          <Text style={styles.userName}>Student</Text>
          <Text style={styles.subHeader}>Faculty of ICT & Multimedia</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
           <Text style={styles.logoutBtn}>Logout ↪</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24, 
    backgroundColor: '#2563EB', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30 
  },
  greeting: { fontSize: 16, color: '#BFDBFE' },
  userName: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', marginTop: 4 },
  subHeader: { fontSize: 14, color: '#93C5FD', marginTop: 4 },
  logoutBtn: { color: '#DBEAFE', fontSize: 14, fontWeight: '600', marginTop: 4 },
  grid: { flexDirection: 'column', padding: 16, gap: 12, marginTop: 10 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  emoji: { fontSize: 32, marginRight: 16 },
  textContainer: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B' },
  cardDesc: { fontSize: 13, color: '#64748B', marginTop: 2 }
});