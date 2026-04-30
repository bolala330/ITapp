import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LecturerHome({ navigation }) {
  
  const handleLogout = () => {
    // Use 'navigate' to bubble up to the Root Navigator where 'Login' is defined.
    // This avoids the "not handled by any navigator" error.
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.greeting}>Welcome Back</Text>
          <Text style={styles.header}>Lecturer Dashboard</Text>
        </View>

        <View style={styles.buttonGrid}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('LecturerReportForm')}>
            <View style={styles.iconContainer}>
              <Ionicons name="document-text-outline" size={28} color="#00d2ff" />
            </View>
            <Text style={styles.cardText}>New Report Form</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('LecturerReportsList')}>
            <View style={styles.iconContainer}>
              <Ionicons name="folder-open-outline" size={28} color="#00d2ff" />
            </View>
            <Text style={styles.cardText}>My Reports</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ClassesScreen')}>
            <View style={styles.iconContainer}>
              <Ionicons name="people-outline" size={28} color="#00d2ff" />
            </View>
            <Text style={styles.cardText}>My Classes</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => alert('Monitoring Module')}>
            <View style={styles.iconContainer}>
              <Ionicons name="pulse-outline" size={28} color="#00d2ff" />
            </View>
            <Text style={styles.cardText}>Monitoring</Text>
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
    backgroundColor: '#0f172a', // Dark futuristic background
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
    textShadowColor: 'rgba(0, 210, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  buttonGrid: {
    gap: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.7)', // Glassmorphism background
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
    backgroundColor: 'rgba(0, 210, 255, 0.1)',
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