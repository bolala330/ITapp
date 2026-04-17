import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function RatingScreen() {
  const [selectedRating, setSelectedRating] = useState(0);
  const [lecturerName, setLecturerName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitRating = async () => {
    if (selectedRating === 0 || !lecturerName.trim() || !courseCode.trim()) {
      Alert.alert("Missing Info", "Please select a star rating and enter the lecturer/course.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "ratings"), {
        lecturerName,
        courseCode,
        rating: selectedRating,
        comments,
        createdAt: new Date(),
        role: 'student'
      });
      setSubmitted(true);
    } catch (e) {
      Alert.alert("Error", "Could not submit rating.");
      console.log(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedRating(0);
    setLecturerName('');
    setCourseCode('');
    setComments('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successEmoji}>✅</Text>
        <Text style={styles.successTitle}>Rating Submitted!</Text>
        <Text style={styles.successSub}>You rated {lecturerName} {selectedRating}/5 stars.</Text>
        <TouchableOpacity style={styles.newRatingBtn} onPress={resetForm}>
          <Text style={styles.newRatingText}>Submit Another Rating</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rate Lecturer</Text>
        <Text style={styles.headerSub}>Help improve our lectures</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Lecturer Name</Text>
        <TextInput style={styles.input} placeholder="e.g. Dr. Smith" value={lecturerName} onChangeText={setLecturerName} />

        <Text style={styles.label}>Course Code</Text>
        <TextInput style={styles.input} placeholder="e.g. CS-201" value={courseCode} onChangeText={setCourseCode} />

        <Text style={styles.label}>Your Rating</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setSelectedRating(star)} activeOpacity={0.7}>
              <Text style={styles.starEmoji}>
                {star <= selectedRating ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
          {selectedRating > 0 && <Text style={styles.ratingText}>{selectedRating}/5</Text>}
        </View>

        <Text style={styles.label}>Comments (Optional)</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="What went well? What can be improved?" value={comments} onChangeText={setComments} multiline numberOfLines={3} />

        <TouchableOpacity 
          style={[styles.submitBtn, isSubmitting && styles.disabledBtn]} 
          onPress={submitRating} 
          disabled={isSubmitting}
        >
          <Text style={styles.submitText}>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 3 },
  formCard: { backgroundColor: '#FFFFFF', margin: 16, padding: 20, borderRadius: 16, elevation: 3 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 14, fontSize: 14, color: '#1E293B', backgroundColor: '#F8FAFC' },
  textArea: { height: 80, textAlignVertical: 'top' },
  starsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  starEmoji: { fontSize: 40, marginRight: 8 },
  ratingText: { fontSize: 18, fontWeight: '700', color: '#2563EB', marginLeft: 10 },
  submitBtn: { backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  disabledBtn: { backgroundColor: '#93C5FD' },
  submitText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  successContainer: { flex: 1, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', padding: 20 },
  successEmoji: { fontSize: 60, marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  successSub: { fontSize: 16, color: '#64748B', marginTop: 8, textAlign: 'center' },
  newRatingBtn: { marginTop: 30, backgroundColor: '#FFFFFF', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, elevation: 2 },
  newRatingText: { color: '#2563EB', fontWeight: '700' }
});  []