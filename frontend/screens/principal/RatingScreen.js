import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,        // ADDED: Fixes the error
  TouchableOpacity,
} from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function PRLRatingScreen() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedLecturer, setExpandedLecturer] = useState(null);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(data);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        data.filter(
          item =>
            item.lecturer?.toLowerCase().includes(q) ||
            item.courseName?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, data]);

  const load = async () => {
    try {
      const snap = await getDocs(collection(db, 'reports'));
      const reports = snap.docs.map(d => d.data());
      const grouped = {};

      reports.forEach(r => {
        const lecturer = r.lecturerName?.trim();
        if (!lecturer) return;

        const feedback = r.recommendations?.trim(); // Lecturer's remarks
        const hasFeedback = feedback && feedback.length > 0;
        const hasPrlFeedback = r.prlFeedback?.trim()?.length > 0;
        const score = r.studentRating ? Number(r.studentRating) : 0; // Student Rating
        
        // Scoring Logic: Lecturer Feedback = 3pts, PRL Feedback = 2pts
        const prlScore = hasPrlFeedback ? 2 : 0;
        const lecScore = hasFeedback ? 3 : 0;

        if (!grouped[lecturer]) {
          grouped[lecturer] = {
            lecturer,
            totalReports: 1,
            totalScore: score + prlScore + lecScore,
            reportsWithFeedback: hasFeedback ? 1 : 0,
            reportsWithPrlFeedback: hasPrlFeedback ? 1 : 0,
            // Arrays to hold comments
            feedbacks: hasFeedback ? [feedback] : [],
            prlFeedbacks: hasPrlFeedback ? [r.prlFeedback] : [],
            courses: r.courseName ? [r.courseName] : [],
            // Detailed lectures list
            lectures: [{
              topic: r.topic,
              date: r.date,
              studentRating: r.studentRating,
              lecComment: feedback,
              prlComment: r.prlFeedback,
              studentComment: r.studentFeedback
            }] 
          };
        } else {
          grouped[lecturer].totalReports++;
          grouped[lecturer].totalScore += score + prlScore + lecScore;
          if (hasFeedback) {
            grouped[lecturer].reportsWithFeedback++;
            grouped[lecturer].feedbacks.push(feedback);
          }
          if (hasPrlFeedback) {
            grouped[lecturer].reportsWithPrlFeedback++;
            grouped[lecturer].prlFeedbacks.push(r.prlFeedback);
          }
          if (r.courseName && !grouped[lecturer].courses.includes(r.courseName)) {
            grouped[lecturer].courses.push(r.courseName);
          }
          // Add to lectures list
          grouped[lecturer].lectures.push({
            topic: r.topic,
            date: r.date,
            studentRating: r.studentRating,
            lecComment: feedback,
            prlComment: r.prlFeedback,
            studentComment: r.studentFeedback
          });
        }
      });

      const result = Object.values(grouped).map(item => ({
        ...item,
        avgRating:
          item.totalReports > 0
            ? (item.totalScore / item.totalReports).toFixed(1)
            : '0.0',
      }));

      setData(result);
      setFiltered(result);
    } catch (e) {
      console.log('PRL Rating error:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const num = parseFloat(rating);
    if (!num) return 'N/A';
    const full = Math.floor(num / 1);
    const half = num % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(empty);
  };

  const getRatingColor = (rating) => {
    const num = parseFloat(rating);
    if (num >= 4) return '#16A34A';
    if (num >= 2) return '#F59E0B';
    return '#EF4444';
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Legend */}
      <View style={styles.legendBar}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
          <Text style={styles.legendText}>Student Rating (Stars)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#7C3AED' }]} />
          <Text style={styles.legendText}>PRL Feedback (Points)</Text>
        </View>
      </View>

      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by lecturer name..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, i) => i.toString()}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No ratings found</Text>
        }
        renderItem={({ item }) => {
          const isExpanded = expandedLecturer === item.lecturer;
          const color = getRatingColor(item.avgRating);

          return (
            <View style={styles.card}>
              {/* Header */}
              <TouchableOpacity 
                style={styles.cardHeader}
                onPress={() => setExpandedLecturer(isExpanded ? null : item.lecturer)}
              >
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarText}>
                    {item.lecturer?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.title}>{item.lecturer}</Text>
                  <Text style={styles.subtitle}>
                    {item.courses.slice(0, 2).join(', ')}
                  </Text>
                </View>
                <View style={[styles.ratingBadge, { backgroundColor: color + '15' }]}>
                  <Text style={[styles.ratingBadgeText, { color }]}>{item.avgRating}</Text>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.divider} />
                  
                  {/* Detailed Comments Section */}
                  <Text style={styles.sectionTitle}>Detailed Comments & Ratings</Text>
                  
                  {item.lectures.map((lec, i) => (
                    <View key={i} style={styles.lectureDetailCard}>
                      <View style={styles.lectureHeader}>
                        <Text style={styles.lectureTopic}>{lec.topic}</Text>
                        <Text style={styles.lectureDate}>{lec.date}</Text>
                      </View>
                      
                      {/* Student Rating */}
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Student Rating:</Text>
                        <Text style={[styles.detailValue, { color: getRatingColor(lec.studentRating) }]}>
                          {renderStars(lec.studentRating)} ({lec.studentRating || 'N/A'})
                        </Text>
                      </View>

                      {/* Lecturer Remarks */}
                      {lec.lecComment ? (
                        <View style={styles.commentBox}>
                          <Text style={styles.commentLabel}>👨‍🏫 Lecturer Remarks:</Text>
                          <Text style={styles.commentText}>{lec.lecComment}</Text>
                        </View>
                      ) : null}

                      {/* PRL Feedback */}
                      {lec.prlComment ? (
                        <View style={[styles.commentBox, { backgroundColor: '#F5F3FF', borderColor: '#8B5CF6' }]}>
                          <Text style={[styles.commentLabel, { color: '#7C3AED' }]}>🎓 Your Feedback:</Text>
                          <Text style={styles.commentText}>{lec.prlComment}</Text>
                        </View>
                      ) : null}

                      {/* Student Text Feedback */}
                      {lec.studentComment ? (
                        <View style={styles.commentBox}>
                          <Text style={[styles.commentLabel, { color: '#D97706' }]}>⭐ Student Comment:</Text>
                          <Text style={styles.commentText}>{lec.studentComment}</Text>
                        </View>
                      ) : null}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  legendBar: { flexDirection: 'row', justifyContent: 'center', gap: 20, margin: 16, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 10, elevation: 1 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', margin: 16, marginBottom: 8, backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, height: 48, elevation: 2 },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#1E293B' },
  list: { padding: 16, paddingTop: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#94A3B8', fontSize: 15 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#D97706', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  headerInfo: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  subtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  ratingBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  ratingBadgeText: { fontSize: 16, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  expandedContent: { paddingBottom: 4 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 12, marginTop: 4 },
  lectureDetailCard: { backgroundColor: '#F8FAFC', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  lectureHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  lectureTopic: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  lectureDate: { fontSize: 11, color: '#64748B' },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailLabel: { fontSize: 12, fontWeight: '600', color: '#64748B', marginRight: 8 },
  detailValue: { fontSize: 12, fontWeight: '700' },
  commentBox: { backgroundColor: '#FEF3C7', borderRadius: 8, padding: 10, marginTop: 8, borderWidth: 1, borderColor: '#FCD34D' },
  commentLabel: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  commentText: { fontSize: 12, color: '#4B5563', lineHeight: 16 }
});