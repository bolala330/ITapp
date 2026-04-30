import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

export default function AttendanceScreen() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from your local Node.js backend
  const fetchAttendance = async () => {
    try {
      // Change 'SE202' to the actual course code or pass it dynamically
      // Assuming your backend is running on port 3000
      const response = await fetch('http://localhost:3000/api/attendance?courseCode=SE202'); 
      const data = await response.json();
      setAttendance(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance History</Text>
      
      <FlatList
        data={attendance}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Course Code:</Text>
              <Text style={styles.value}>{item.courseCode || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{item.date || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text style={[
                styles.value, 
                { color: item.status === 'Present' ? 'green' : 'red', fontWeight: 'bold' }
              ]}>
                {item.status || 'Unknown'}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No records found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { 
    padding: 15, 
    backgroundColor: '#f9f9f9', 
    marginBottom: 10, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#eee' 
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { fontSize: 14, color: '#555' },
  value: { fontSize: 14, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' }
});