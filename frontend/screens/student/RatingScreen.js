import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function StudentRatingScreen() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const auth = getAuth();

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = async () => {
    try {
      const snap = await getDocs(collection(db, 'attendance'));
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter unique lectures to avoid duplicates
      const unique = [];
      const seen = new Set();
      
      docs.forEach(doc => {
        const key = `${doc.courseCode}-${doc.date}`;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(doc);
        }
      });

      setLectures(unique);
    } catch (e) {
      console.log("Error loading lectures:", e);
    } finally {
      setLoading(false);
    }
  };

  const openRatingModal = (lecture) => {
    setSelectedLecture(lecture);
    setRating(0);
    setComment('');
    setModalVisible(true);
  };

  const submitRating = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'ratings'), {
        courseCode: selectedLecture.courseCode,
        lecturerName: selectedLecture.lecturerName,
        date: selectedLecture.date,
        rating: rating, 
        comment: comment, // Saving the comment
        studentEmail: auth.currentUser.email,
        createdAt: new Date()
      });
      
      Alert.alert('Success', 'Thank you for your feedback!');
      setModalVisible(false);
    } catch (e) {
      Alert.alert('Error', 'Could not save rating.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (score, interactive = false) => {
    return (
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity 
            key={star} 
            onPress={() => interactive && setRating(star)} 
            disabled={!interactive}
            activeOpacity={0.7}
          >
            <Text style={[styles.star, interactive && styles.starInteractive]}>
              {score >= star ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#2563EB" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rate Lectures</Text>
        <Text style={styles.headerSub}>Share your experience</Text>
      </View>

      <FlatList
        data={lectures}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openRatingModal(item)}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.courseCode}>{item.courseCode}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <Text style={styles.lecturer}>by {item.lecturerName}</Text>
            </View>
            <View style={styles.actionRow}>
              <Text style={styles.actionText}>Tap to Rate & Comment</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Rating Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate Experience</Text>
            {selectedLecture && (
              <Text style={styles.modalSub}>{selectedLecture.courseCode}</Text>
            )}
            
            <View style={styles.modalCenter}>
              {renderStars(rating, true)}
            </View>

            <Text style={styles.label}>Your Comment</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="What did you like or dislike? (Optional)"
              value={comment}
              onChangeText={setComment}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={submitRating} disabled={submitting}>
              <Text style={styles.saveBtnText}>{submitting ? 'Submitting...' : 'Submit Review'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 14, color: '#64748B', marginTop: 4 },
  list: { padding: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  courseCode: { fontSize: 18, fontWeight: '700', color: '#2563EB' },
  date: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  lecturer: { fontSize: 13, fontWeight: '600', color: '#64748B', textAlign: 'right' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  actionText: { fontSize: 15, fontWeight: '600', color: '#2563EB' },
  arrow: { fontSize: 20, color: '#CBD5E1', fontWeight: '300' },
  starRow: { flexDirection: 'row', gap: 8 },
  star: { fontSize: 32 },
  starInteractive: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, paddingBottom: 50 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  modalSub: { fontSize: 16, color: '#64748B', marginBottom: 20 },
  modalCenter: { alignItems: 'center', marginBottom: 30 },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 10 },
  commentInput: { backgroundColor: '#F1F5F9', padding: 16, borderRadius: 16, minHeight: 120, fontSize: 15, color: '#334155', marginBottom: 24 },
  saveBtn: { backgroundColor: '#2563EB', padding: 16, borderRadius: 16, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  cancelText: { textAlign: 'center', color: '#94A3B8', marginTop: 16, fontSize: 15, fontWeight: '600' }
});