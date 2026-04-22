import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function LecturerRatingScreen() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      const user = auth.currentUser;
      const q = query(
        collection(db, 'ratings'), 
        where('lecturerName', '==', user.email || user.displayName)
      );
      
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => doc.data());
      
      // Sort by newest
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      
      setRatings(list);
    } catch (e) {
      console.log("Error loading lecturer ratings:", e);
    } finally {
      setLoading(false);
    }
  };

  const getStars = (score) => {
    if (!score) return 'N/A';
    return '★'.repeat(Math.floor(score)) + '☆'.repeat(5 - Math.floor(score));
  };

  const getColor = (score) => {
    if (!score) return '#94A3B8';
    if (score >= 4) return '#16A34A'; 
    if (score >= 3) return '#F59E0B'; 
    return '#EF4444'; 
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#2563EB" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Ratings</Text>
        <Text style={styles.headerSub}>Feedback from students</Text>
      </View>

      <FlatList
        data={ratings}
        keyExtractor={(item, i) => i.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Header: Stars & Date */}
            <View style={styles.cardHeader}>
               <View style={[styles.scoreBadge, { backgroundColor: getColor(item.rating) + '15', borderColor: getColor(item.rating) }]}>
                 <Text style={[styles.scoreText, { color: getColor(item.rating) }]}>{item.rating}/5</Text>
               </View>
               <Text style={styles.date}>{item.date}</Text>
            </View>
            
            {/* Course Info */}
            <View style={styles.infoRow}>
                <View style={styles.iconBox}><Text style={styles.icon}>📘</Text></View>
                <Text style={styles.topic}>{item.courseCode}</Text>
            </View>

            {/* Comment Bubble */}
            {item.comment ? (
              <View style={styles.commentBox}>
                 <Text style={styles.quote}>“</Text>
                 <Text style={styles.comment}>{item.comment}</Text>
              </View>
            ) : (
              <Text style={styles.noComment}>No comment provided</Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No ratings received yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 14, color: '#64748B' },
  list: { padding: 20 },
  empty: { textAlign: 'center', color: '#94A3B8', marginTop: 40, fontSize: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  scoreBadge: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: 10, borderWidth: 1.5 },
  scoreText: { fontSize: 20, fontWeight: '800' },
  date: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 18 },
  topic: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  commentBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#2563EB', position: 'relative' },
  quote: { fontSize: 40, color: '#E2E8F0', position: 'absolute', top: -10, left: 5, fontWeight: '300' },
  comment: { fontSize: 15, color: '#334155', lineHeight: 22, marginLeft: 20, fontStyle: 'italic' },
  noComment: { fontSize: 13, color: '#CBD5E1', fontStyle: 'italic' }
});