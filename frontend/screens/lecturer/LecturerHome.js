import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';

export default function LecturerHome() {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  // Extract name from display name, fallback to email if name not set
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Lecturer';

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

  const menuItems = [
    { title: 'My Classes', icon: '📚', screen: 'ClassesScreen', color: '#0EA5E9' },
    { title: 'New Report', icon: '📝', screen: 'LecturerReportForm', color: '#059669' },
    { title: 'My Reports', icon: '📂', screen: 'LecturerReportsList', color: '#6366F1' },
    { title: 'Monitoring', icon: '📊', screen: 'MonitoringScreen', color: '#D97706' },
    { title: 'My Ratings', icon: '⭐', screen: 'LecturerRatingScreen', color: '#DB2777' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome,</Text>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.role}>Lecturer Dashboard</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout ↪</Text>
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
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <Text style={styles.label}>{item.title}</Text>
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
    alignItems: 'center',
    padding: 30, 
    backgroundColor: '#FFFFFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0' 
  },
  welcome: { fontSize: 16, color: '#64748B', fontWeight: '500' },
  userName: { fontSize: 28, fontWeight: '800', color: '#0F172A', marginTop: 4 },
  role: { fontSize: 14, color: '#94A3B8', marginTop: 2 },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  logoutText: { color: '#EF4444', fontWeight: '600', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, justifyContent: 'space-between' },
  card: { 
    width: '48%', 
    backgroundColor: '#FFFFFF', 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 20, 
    alignItems: 'center', 
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
    borderWidth: 1, borderColor: '#F1F5F9'
  },
  iconContainer: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  icon: { fontSize: 24 },
  label: { fontSize: 14, fontWeight: '700', color: '#1E293B' }
});