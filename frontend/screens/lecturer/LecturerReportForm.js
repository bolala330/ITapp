import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function LecturerReportForm() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    courseName: '', courseCode: '', topic: '', week: '', 
    date: '', venue: '', studentsPresent: '', totalStudents: '',
    outcomes: '', recommendations: ''
  });

  const handleSubmit = async () => {
    if (!form.courseName || !form.topic) {
      Alert.alert('Error', 'Please fill in at least Course Name and Topic.');
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth();
      const lecturerName = auth.currentUser?.displayName || 'Unknown Lecturer';
      
      await addDoc(collection(db, 'reports'), {
        ...form,
        studentsPresent: Number(form.studentsPresent),
        totalStudents: Number(form.totalStudents),
        lecturerName,
        createdAt: serverTimestamp()
      });
      Alert.alert('Success', 'Report submitted successfully!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Submit Weekly Report</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Course Name & Code</Text>
        <TextInput style={styles.input} placeholder="e.g. Intro to CS" value={form.courseName} onChangeText={t => setForm({...form, courseName: t})} />
        <TextInput style={styles.input} placeholder="e.g. CS101" value={form.courseCode} onChangeText={t => setForm({...form, courseCode: t})} />
      </View>

      <View style={styles.row}>
        <View style={{flex: 1, marginRight: 10}}>
          <Text style={styles.label}>Week</Text>
          <TextInput style={styles.input} placeholder="1" value={form.week} onChangeText={t => setForm({...form, week: t})} />
        </View>
        <View style={{flex: 1, marginLeft: 10}}>
          <Text style={styles.label}>Date</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={form.date} onChangeText={t => setForm({...form, date: t})} />
        </View>
      </View>

      <Text style={styles.label}>Topic Taught</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Details of the topic..." value={form.topic} onChangeText={t => setForm({...form, topic: t})} multiline />

      <Text style={styles.label}>Venue</Text>
      <TextInput style={styles.input} placeholder="Room No" value={form.venue} onChangeText={t => setForm({...form, venue: t})} />

      <View style={styles.row}>
        <View style={{flex: 1}}>
          <Text style={styles.label}>Total Students</Text>
          <TextInput style={styles.input} keyboardType="numeric" placeholder="0" value={form.totalStudents} onChangeText={t => setForm({...form, totalStudents: t})} />
        </View>
        <View style={{flex: 1, marginLeft: 10}}>
          <Text style={styles.label}>Present</Text>
          <TextInput style={styles.input} keyboardType="numeric" placeholder="0" value={form.studentsPresent} onChangeText={t => setForm({...form, studentsPresent: t})} />
        </View>
      </View>

      <Text style={styles.label}>Outcomes</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Learning outcomes..." value={form.outcomes} onChangeText={t => setForm({...form, outcomes: t})} multiline />
      
      <Text style={styles.label}>Recommendations</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Any suggestions..." value={form.recommendations} onChangeText={t => setForm({...form, recommendations: t})} multiline />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF"/> : <Text style={styles.btnText}>Submit Report</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#0F172A' },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 5 },
  input: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, fontSize: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', marginBottom: 10 },
  btn: { backgroundColor: '#059669', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});