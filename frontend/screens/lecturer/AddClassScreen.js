import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function AddClassScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!courseName.trim() || !courseCode.trim()) {
      Alert.alert('Error', 'Please enter both Course Name and Course Code.');
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      
      // Save to 'courses' collection
      await addDoc(collection(db, 'courses'), {
        courseName,
        courseCode,
        description,
        lecturerId: auth.currentUser?.uid, // Link to this lecturer
        studentsEnrolled: 0,
        createdAt: new Date()
      });

      Alert.alert('Success', 'Class added successfully!');
      navigation.goBack(); // Go back to list screen
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add New Class</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Course Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Software Engineering" 
          value={courseName} 
          onChangeText={setCourseName} 
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Course Code</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. SE-301" 
          value={courseCode} 
          onChangeText={setCourseCode} 
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Brief description of the module..." 
          value={description} 
          onChangeText={setDescription} 
          multiline 
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Save Class</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#0F172A' },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: { 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 10, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  btn: { backgroundColor: '#059669', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});