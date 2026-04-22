import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function PLRatingScreen() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      // Fetch from 'reports' to get the qualitative data
      const snap = await getDocs(collection(db, 'reports'));
      const reports = snap.docs.map(d => d.data());
      
      // Filter reports that have ratings or comments
      const ratedReports = reports.filter(r => r.studentRating || r.recommendations || r.studentFeedback);
      
      setRatings(ratedReports);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return '-';
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#4F46E5" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Ratings</Text>
        <Text style={styles.headerSub}>View ratings & comments</Text>
      </View>

      <FlatList
        data={ratings}
        keyExtractor={(item, i) => i.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Header Info */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.topic}>{item.topic}</Text>
                <Text style={styles.meta}>{item.courseName} • {item.date}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{item.studentRating || 'N/A'}</Text>
                <Text style={styles.stars}>{renderStars(item.studentRating)}</Text>
              </View>
            </View>

            {/* Comments Section */}
            <View style={styles.divider} />

            {/* Lecturer Remarks */}
            {item.recommendations && (
              <View style={styles.commentBlock}>
                <Text style={styles.commentTitle}>👨‍🏫 Lecturer Remarks:</Text>
                <Text style={styles.commentBody}>{item.recommendations}</Text>
              </View>
            )}

            {/* Student Feedback */}
            {item.studentFeedback && (
              <View style={styles.commentBlock}>
                <Text style={styles.commentTitle}>⭐ Student Comment:</Text>
                <Text style={styles.commentBody}>{item.studentFeedback}</Text>
              </View>
            )}
            
            {/* PRL Feedback */}
            {item.prlFeedback && (
               <View style={styles.commentBlock}>
                <Text style={styles.commentTitle}>🎓 PRL Feedback:</Text>
                <Text style={styles.commentBody}>{item.prlFeedback}</Text>
              </View>
            )}

            {(!item.recommendations && !item.studentFeedback && !item.prlFeedback) && (
               <Text style={styles.noComment}>No comments available.</Text>
            )}
          </View>
        )}
      />
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  topic: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  meta: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  ratingBadge: { alignItems: 'flex-end' },
  ratingText: { fontSize: 18, fontWeight: '800', color: '#D97706' },
  stars: { fontSize: 14, color: '#D97706', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
  commentBlock: { backgroundColor: '#FFFBEB', padding: 10, borderRadius: 8, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#F59E0B' },
  commentTitle: { fontSize: 12, fontWeight: '700', color: '#92400E', marginBottom: 4 },
  commentBody: { fontSize: 13, color: '#4B5563', lineHeight: 18 },
  noComment: { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' }
});