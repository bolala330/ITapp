import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StudentHome({ navigation }) {
  
  const handleLogout = () => {
    // Fixed: Navigate instead of Reset to handle parent navigators
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.greeting}>Student Portal</Text>
          <Text style={styles.header}>Student Dashboard</Text>
        </View>

        <View style={styles.buttonGrid}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('StudentAttendance')}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-check-outline" size={28} color="#2dd4bf" />
            </View>
            <Text style={styles.cardText}>Attendance</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('StudentLectures')}>
            <View style={styles.iconContainer}>
              <Ionicons name="play-circle-outline" size={28} color="#2dd4bf" />
            </View>
            <Text style={styles.cardText}>My Lectures</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('StudentMonitoring')}>
            <View style={styles.iconContainer}>
              <Ionicons name="bar-chart-outline" size={28} color="#2dd4bf" />
            </View>
            <Text style={styles.cardText}>Monitoring</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('StudentRating')}>
            <View style={styles.iconContainer}>
              <Ionicons name="thumbs-up-outline" size={28} color="#2dd4bf" />
            </View>
            <Text style={styles.cardText}>Rating</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  headerContainer: {
    marginBottom: 30,
    marginTop: 10,
  },
  greeting: {
    color: '#94a3b8',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginTop: 5,
    textShadowColor: 'rgba(45, 212, 191, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  buttonGrid: {
    gap: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    padding: 10,
    borderRadius: 12,
    marginRight: 15,
  },
  cardText: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ef4444',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});