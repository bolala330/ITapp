import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { db } from '../../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function LecturerReportForm({ navigation }) {
  const auth = getAuth();
  const [form, setForm] = useState({
    courseName: '',
    courseCode: '',
    className: '',
    topic: '',
    date: '',
    week: '',
    totalStudents: '',
    studentsPresent: '',
    recommendations: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    if (!form.topic || !form.date || !form.className) {
      Alert.alert('Missing Info', 'Please fill in Topic, Date, and Class Name.');
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'reports'), {
        ...form,
        totalStudents: Number(form.totalStudents),
        studentsPresent: Number(form.studentsPresent),
        lecturerName: auth.currentUser.displayName || auth.currentUser.email,
        createdAt: new Date(),
        prlFeedback: '', // Empty initially for PRL to fill
        studentRating: null, // Placeholder for student rating
      });
      Alert.alert('Success', 'Report submitted successfully!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Could not submit report.');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Lecture Report</Text>
        <Text style={styles.headerSub}>Submit class progress & attendance</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course Name</Text>
            <TextInput style={styles.input} value={form.courseName} onChangeText={(v) => handleChange('courseName', v)} placeholder="e.g. Web Dev" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Code</Text>
            <TextInput style={styles.input} value={form.courseCode} onChangeText={(v) => handleChange('courseCode', v)} placeholder="e.g. WD101" />
          </View>
        </View>

        <Text style={styles.label}>Class Name / Group</Text>
        <TextInput style={styles.input} value={form.className} onChangeText={(v) => handleChange('className', v)} placeholder="e.g. Year 1 Group A" />

        <Text style={styles.label}>Topic Taught</Text>
        <TextInput style={[styles.input, styles.textArea]} value={form.topic} onChangeText={(v) => handleChange('topic', v)} placeholder="What did you cover today?" multiline numberOfLines={3} />

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput style={styles.input} value={form.date} onChangeText={(v) => handleChange('date', v)} placeholder="DD/MM/YYYY" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Week</Text>
            <TextInput style={styles.input} value={form.week} onChangeText={(v) => handleChange('week', v)} placeholder="e.g. 1" keyboardType="numeric" />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total Students</Text>
            <TextInput style={styles.input} value={form.totalStudents} onChangeText={(v) => handleChange('totalStudents', v)} placeholder="0" keyboardType="numeric" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Present</Text>
            <TextInput style={[styles.input, { borderColor: Number(form.studentsPresent) > Number(form.totalStudents) ? '#EF4444' : '#E2E8F0' }]} value={form.studentsPresent} onChangeText={(v) => handleChange('studentsPresent', v)} placeholder="0" keyboardType="numeric" />
          </View>
        </View>

        <Text style={styles.label}>Recommendations / Remarks</Text>
        <TextInput style={[styles.input, styles.textArea]} value={form.recommendations} onChangeText={(v) => handleChange('recommendations', v)} placeholder="Any issues or notes..." multiline numberOfLines={4} />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Report</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  headerSub: { fontSize: 13, color: '#64748B' },
  form: { padding: 20 },
  row: { flexDirection: 'row', gap: 12 },
  inputGroup: { flex: 1 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, fontSize: 14, color: '#0F172A', marginBottom: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#059669', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10 },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }
});