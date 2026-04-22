import React, { useState, useEffect } from 'react';
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

// Firebase Imports
import { db } from '../../services/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function PLReportsScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const snap = await getDocs(collection(db, 'reports'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setReports(list);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const openFeedback = (item) => {
    setSelectedReport(item);
    setFeedback(item.prlFeedback || '');
    setModalVisible(true);
  };

  const submitFeedback = async () => {
    if (!selectedReport) return;
    try {
      await updateDoc(doc(db, 'reports', selectedReport.id), {
        prlFeedback: feedback
      });
      Alert.alert('Success', 'Feedback added.');
      setModalVisible(false);
      loadReports(); // Reload to show updated feedback
    } catch (e) {
      Alert.alert('Error', 'Could not save.');
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#4F46E5" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lecturer Reports</Text>
        <Text style={styles.headerSub}>Review & Add Feedback</Text>
      </View>

      <FlatList
        data={reports}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.topic}</Text>
            <Text style={styles.sub}>{item.courseName} • {item.date}</Text>
            <Text style={styles.lecturer}>By: {item.lecturerName}</Text>
            
            <View style={styles.divider} />

            <Text style={styles.lbl}>Your Feedback:</Text>
            {item.prlFeedback ? (
              <Text style={styles.feedbackText}>{item.prlFeedback}</Text>
            ) : (
              <Text style={styles.noFeedback}>No feedback added yet.</Text>
            )}

            <TouchableOpacity style={styles.btn} onPress={() => openFeedback(item)}>
              <Text style={styles.btnText}>{item.prlFeedback ? 'Edit Feedback' : 'Add Feedback'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add PRL Feedback</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your review..." 
              value={feedback} 
              onChangeText={setFeedback} 
              multiline
            />
            <TouchableOpacity style={styles.saveBtn} onPress={submitFeedback}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtn}>Cancel</Text>
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
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  title: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  sub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  lecturer: { fontSize: 12, color: '#4F46E5', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
  lbl: { fontSize: 12, fontWeight: '700', color: '#374151' },
  feedbackText: { fontSize: 13, color: '#059669', marginTop: 4, fontStyle: 'italic' },
  noFeedback: { fontSize: 12, color: '#EF4444', marginTop: 4 },
  btn: { backgroundColor: '#4F46E5', padding: 10, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 12, margin: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, minHeight: 100, textAlignVertical: 'top', marginBottom: 16 },
  saveBtn: { backgroundColor: '#4F46E5', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700' },
  closeBtn: { textAlign: 'center', color: '#6B7280', marginTop: 12 }
});