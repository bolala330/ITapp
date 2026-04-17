import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function PRLRatingScreen() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

        const feedback = r.recommendations?.trim();
        const hasFeedback = feedback && feedback.length > 0;
        const hasPrlFeedback = r.prlFeedback?.trim()?.length > 0;
        const score = hasFeedback ? 3 : 0;
        const prlScore = hasPrlFeedback ? 2 : 0;

        if (!grouped[lecturer]) {
          grouped[lecturer] = {
            lecturer,
            totalReports: 1,
            totalScore: score + prlScore,
            reportsWithFeedback: hasFeedback ? 1 : 0,
            reportsWithPrlFeedback: hasPrlFeedback ? 1 : 0,
            feedbacks: hasFeedback ? [feedback] : [],
            prlFeedbacks: hasPrlFeedback ? [r.prlFeedback] : [],
            courses: r.courseName ? [r.courseName] : [],
            topics: r.topic ? [r.topic] : [],
          };
        } else {
          grouped[lecturer].totalReports++;
          grouped[lecturer].totalScore += score + prlScore;
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
          if (r.topic) grouped[lecturer].topics.push(r.topic);
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
          <Text style={styles.legendText}>Lecturer Feedback (3pts)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#7C3AED' }]} />
          <Text style={styles.legendText}>PRL Feedback (2pts)</Text>
        </View>
      </View>

      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by lecturer name or course..."
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
          <Text style={styles.emptyText}>
            {search ? 'No matching lecturers' : 'No ratings found'}
          </Text>
        }
        renderItem={({ item }) => {
          const color = getRatingColor(item.avgRating);

          return (
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarText}>
                    {item.lecturer?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.title}>{item.lecturer}</Text>
                  <Text style={styles.subtitle}>
                    {item.courses.slice(0, 2).join(', ')}
                    {item.courses.length > 2 ? ` +${item.courses.length - 2}` : ''}
                  </Text>
                </View>
                <View style={[styles.ratingBadge, { backgroundColor: color + '15' }]}>
                  <Text style={[styles.ratingBadgeText, { color }]}>
                    {item.avgRating}
                  </Text>
                </View>
              </View>

              {/* Rating Display */}
              <View style={styles.ratingBox}>
                <Text style={[styles.stars, { color }]}>{renderStars(item.avgRating)}</Text>
                <Text style={styles.ratingSub}>out of 5.0</Text>
              </View>

              {/* Score Breakdown */}
              <View style={styles.divider} />
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownItem}>
                  <View style={styles.breakdownDotBlue} />
                  <Text style={styles.breakdownText}>
                    Lecturer: {item.reportsWithFeedback}/{item.totalReports}
                  </Text>
                </View>
                <View style={styles.breakdownItem}>
                  <View style={styles.breakdownDotPurple} />
                  <Text style={styles.breakdownText}>
                    PRL: {item.reportsWithPrlFeedback}/{item.totalReports}
                  </Text>
                </View>
              </View>

              {/* Topics Covered */}
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Topics Covered ({item.topics.length})</Text>
              <View style={styles.topicsList}>
                {item.topics.slice(0, 4).map((t, i) => (
                  <View key={i} style={styles.topicPill}>
                    <Text style={styles.topicPillText} numberOfLines={1}>{t}</Text>
                  </View>
                ))}
                {item.topics.length > 4 && (
                  <Text style={styles.moreText}>+{item.topics.length - 4} more</Text>
                )}
              </View>

              {/* Lecturer Feedback */}
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Lecturer Feedback ({item.feedbacks.length})</Text>
              {item.feedbacks.length === 0 ? (
                <Text style={styles.noneText}>None provided</Text>
              ) : (
                <View style={styles.feedbackList}>
                  {item.feedbacks.slice(0, 2).map((f, i) => (
                    <View key={i} style={styles.feedbackItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.feedbackText} numberOfLines={2}>{f}</Text>
                    </View>
                  ))}
                  {item.feedbacks.length > 2 && (
                    <Text style={styles.moreText}>+{item.feedbacks.length - 2} more</Text>
                  )}
                </View>
              )}

              {/* PRL Feedback */}
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>PRL Feedback ({item.prlFeedbacks.length})</Text>
              {item.prlFeedbacks.length === 0 ? (
                <Text style={styles.noneText}>None added yet</Text>
              ) : (
                <View style={styles.feedbackList}>
                  {item.prlFeedbacks.slice(0, 2).map((f, i) => (
                    <View key={i} style={styles.prlFeedbackItem}>
                      <Text style={styles.prlBullet}>•</Text>
                      <Text style={styles.prlFeedbackText} numberOfLines={2}>{f}</Text>
                    </View>
                  ))}
                  {item.prlFeedbacks.length > 2 && (
                    <Text style={styles.moreText}>+{item.prlFeedbacks.length - 2} more</Text>
                  )}
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
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    margin: 16,
    marginBottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingBadgeText: {
    fontSize: 16,
    fontWeight: '800',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  stars: {
    fontSize: 20,
    letterSpacing: 2,
  },
  ratingSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breakdownDotBlue: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  breakdownDotPurple: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C3AED',
  },
  breakdownText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  noneText: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  topicsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  topicPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    maxWidth: '60%',
  },
  topicPillText: {
    fontSize: 12,
    color: '#475569',
  },
  moreText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
  },
  feedbackList: {
    gap: 4,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 14,
    color: '#2563EB',
    marginRight: 8,
    marginTop: 1,
  },
  feedbackText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  prlFeedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  prlBullet: {
    fontSize: 14,
    color: '#7C3AED',
    marginRight: 8,
    marginTop: 1,
  },
  prlFeedbackText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
});