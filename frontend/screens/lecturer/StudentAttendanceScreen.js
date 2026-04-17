import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function StudentAttendanceScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { className } = route.params || {}; // Passed from ClassesScreen

  // Dummy data - In real app, fetch from 'users' collection where enrolledCourse == classId
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Johnson', present: true },
    { id: 2, name: 'Bob Smith', present: false },
    { id: 3, name: 'Charlie Brown', present: true },
    { id: 4, name: 'Diana Prince', present: true },
  ]);

  const toggleAttendance = (id) => {
    const updated = students.map(s => s.id === id ? { ...s, present: !s.present } : s);
    setStudents(updated);
  };

  const saveAttendance = () => {
    // Logic to save to Firestore: collection(db, 'attendance').add(...)
    Alert.alert('Success', `Attendance saved for ${className || 'Class'}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance: {className}</Text>
      <FlatList
        data={students}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => toggleAttendance(item.id)}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={[styles.status, item.present ? styles.present : styles.absent]}>
              <Text style={styles.statusText}>{item.present ? 'Present' : 'Absent'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.btnSave} onPress={saveAttendance}>
        <Text style={styles.saveText}>Save Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { fontSize: 20, fontWeight: 'bold', padding: 20, paddingBottom: 10, backgroundColor: '#FFF' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  name: { fontSize: 16, color: '#334155' },
  status: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  present: { backgroundColor: '#DCFCE7' },
  absent: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#1E293B' },
  btnSave: { backgroundColor: '#059669', margin: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
  saveText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});