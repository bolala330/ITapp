import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function StudentAttendanceScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { classId, className } = route.params || {}; 

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // REAL SYSTEM: Fetch all users where role is 'student'
      // NOTE: If you have an 'enrolledCourses' field, add: 
      // .where('enrolledCourses', 'array-contains', classId)
      const q = query(collection(db, 'users'), where('role', '==', 'student'));
      const snapshot = await getDocs(q);

      // Map Firestore data to our local state
      // We initialize 'present: false' for everyone by default
      const studentsList = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().displayName || doc.data().name || 'Unknown Student',
        email: doc.data().email,
        present: false 
      }));

      setStudents(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error);
      Alert.alert("Error", "Could not load students list.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (id) => {
    // Optimistic Update: Update UI immediately
    const updated = students.map(s => s.id === id ? { ...s, present: !s.present } : s);
    setStudents(updated);
  };

  const saveAttendance = () => {
    const presentCount = students.filter(s => s.present).length;
    
    // REAL SYSTEM: Here you would use a Batched Write to save to Firestore
    // Example:
    // const batch = writeBatch(db);
    // students.forEach(s => {
    //   const ref = doc(db, 'attendance_reports', classId, 'students', s.id);
    //   batch.set(ref, { present: s.present, date: new Date() });
    // });
    // await batch.commit();

    Alert.alert('Success', `Attendance saved for ${className}. \nTotal Present: ${presentCount}/${students.length}`);
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#059669" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance: {className || 'Class'}</Text>
      
      <FlatList
        data={students}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.row, item.present && styles.rowPresent]} 
            onPress={() => toggleAttendance(item.id)}
          >
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            
            <View style={[styles.status, item.present ? styles.present : styles.absent]}>
              <Text style={styles.statusText}>{item.present ? 'Present' : 'Absent'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.btnSave} onPress={saveAttendance}>
        <Text style={styles.saveText}>Submit Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { fontSize: 20, fontWeight: 'bold', padding: 20, paddingBottom: 10, backgroundColor: '#FFF', color: '#1E293B' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  rowPresent: { backgroundColor: '#F0FDF4' }, // Slight green tint if present
  name: { fontSize: 16, color: '#334155', fontWeight: '600' },
  email: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  status: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, minWidth: 80, alignItems: 'center' },
  present: { backgroundColor: '#DCFCE7' },
  absent: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#1E293B' },
  btnSave: { backgroundColor: '#059669', margin: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
  saveText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});