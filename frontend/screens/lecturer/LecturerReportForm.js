import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

export default function LecturerReportForm({ navigation }) {
  const [formData, setFormData] = useState({
    faculty: 'Faculty of ICT',
    className: '',
    week: '',
    date: '',
    courseName: '',
    courseCode: '',
    lecturerName: auth.currentUser?.email || '',
    actualStudents: '',
    totalRegistered: '',
    venue: '',
    time: '',
    topic: '',
    outcomes: '',
    recommendations: ''
  });

  const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async () => {
    // Basic Validation
    if (!formData.className || !formData.topic) {
      Alert.alert("Error", "Please fill in required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        ...formData,
        lecturerId: auth.currentUser.uid,
        createdAt: new Date(),
        status: 'Pending' // For PRL to review
      });
      Alert.alert("Success", "Report submitted successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const Input = ({ label, name, ...props }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[name]}
        onChangeText={text => handleChange(name, text)}
        {...props}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Lecturer Reporting Form</Text>

      <Input label="Faculty Name" name="faculty" editable={false} style={styles.disabledInput} />
      <Input label="Class Name" name="className" placeholder="e.g., SE-01" />
      <Input label="Week of Reporting" name="week" placeholder="e.g., Week 5" />
      <Input label="Date of Lecture" name="date" placeholder="YYYY-MM-DD" />
      
      <Input label="Course Name" name="courseName" />
      <Input label="Course Code" name="courseCode" />
      <Input label="Lecturer's Name" name="lecturerName" />
      
      <Input label="Actual No. Present" name="actualStudents" keyboardType="numeric" />
      <Input label="Total Registered" name="totalRegistered" keyboardType="numeric" />
      
      <Input label="Venue" name="venue" placeholder="Room No." />
      <Input label="Scheduled Time" name="time" placeholder="e.g., 10:00 AM" />
      <Input label="Topic Taught" name="topic" />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Learning Outcomes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.outcomes}
          onChangeText={text => handleChange('outcomes', text)}
          placeholder="List learning outcomes..."
          multiline
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Recommendations</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.recommendations}
          onChangeText={text => handleChange('recommendations', text)}
          placeholder="Enter recommendations..."
          multiline
        />
      </View>

      <Button title="Submit Report" onPress={handleSubmit} color="#28a745" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputGroup: { marginBottom: 15 },
  label: { fontWeight: '600', marginBottom: 5, fontSize: 14, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16 },
  disabledInput: { backgroundColor: '#f0f0f0', color: '#666' },
  textArea: { height: 80, textAlignVertical: 'top' }
});