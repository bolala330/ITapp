import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function PLCoursesScreen() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [lecturerName, setLecturerName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const snap = await getDocs(collection(db, 'courses'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCourses(list);
    } catch (e) {
      console.log('Error loading courses:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    if (!courseName.trim() || !courseCode.trim() || !lecturerName.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'courses'), {
        courseName: courseName.trim(),
        courseCode: courseCode.trim(),
        assignedLecturer: lecturerName.trim(),
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Course assigned successfully!');
      setModalVisible(false);
      setCourseName('');
      setCourseCode('');
      setLecturerName('');
      loadCourses();
    } catch (e) {
      Alert.alert('Error', 'Could not save course.');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteDoc(doc(db, 'courses', id));
        loadCourses();
      }}
    ]);
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#4F46E5" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Courses</Text>
        <Text style={styles.headerSub}>Create courses & assign lecturers</Text>
      </View>

      <FlatList
        data={courses}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.courseCode}>{item.courseCode}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}><Text style={styles.deleteBtn}>🗑️</Text></TouchableOpacity>
            </View>
            <Text style={styles.courseName}>{item.courseName}</Text>
            <View style={styles.assigneeRow}>
              <Text style={styles.label}>Assigned to:</Text>
              <Text style={styles.lecturerName}>👨‍🏫 {item.assignedLecturer}</Text>
            </View>
          </View>
        )}
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign Course</Text>
            
            <Text style={styles.inputLabel}>Course Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Web Development" value={courseName} onChangeText={setCourseName} />
            
            <Text style={styles.inputLabel}>Course Code</Text>
            <TextInput style={styles.input} placeholder="e.g. WD101" value={courseCode} onChangeText={setCourseCode} />
            
            <Text style={styles.inputLabel}>Assign Lecturer Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Dr. Smith" value={lecturerName} onChangeText={setLecturerName} />
            
            <TouchableOpacity style={styles.saveBtn} onPress={handleAddCourse} disabled={saving}>
              <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Assignment'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  headerSub: { fontSize: 13, color: '#6B7280' },
  list: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  courseCode: { fontSize: 13, fontWeight: '700', color: '#6366F1' },
  deleteBtn: { fontSize: 18 },
  courseName: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 10 },
  assigneeRow: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 13, color: '#6B7280', marginRight: 8 },
  lecturerName: { fontSize: 13, fontWeight: '600', color: '#059669' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { fontSize: 28, color: '#FFFFFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 4 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 16 },
  saveBtn: { backgroundColor: '#4F46E5', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700' },
  cancelBtn: { padding: 12, alignItems: 'center' },
  cancelBtnText: { color: '#6B7280', fontWeight: '600' }
});