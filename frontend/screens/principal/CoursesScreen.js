import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function PRLCoursesScreen() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(data);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        data.filter(
          item =>
            item.courseName?.toLowerCase().includes(q) ||
            item.courseCode?.toLowerCase().includes(q) ||
            item.lecturers?.some(l => l.toLowerCase().includes(q))
        )
      );
    }
  }, [search, data]);

  const loadCourses = async () => {
    try {
      const snap = await getDocs(collection(db, 'reports'));
      const reports = snap.docs.map(d => d.data());
      const grouped = {};

      reports.forEach(r => {
        const key = r.courseCode || r.courseName;
        if (!key) return;

        if (!grouped[key]) {
          grouped[key] = {
            courseCode: r.courseCode || 'N/A',
            courseName: r.courseName || 'N/A',
            className: r.className || 'N/A',
            lecturers: r.lecturerName ? [r.lecturerName] : [],
            lectures: [],
            totalStudents: Number(r.totalStudents || 0),
          };
        } else {
          if (r.lecturerName && !grouped[key].lecturers.includes(r.lecturerName)) {
            grouped[key].lecturers.push(r.lecturerName);
          }
          if (Number(r.totalStudents) > grouped[key].totalStudents) {
            grouped[key].totalStudents = Number(r.totalStudents);
          }
        }

        grouped[key].lectures.push({
          week: r.week || '?',
          date: r.date || 'N/A',
          topic: r.topic || 'N/A',
          lecturer: r.lecturerName || 'N/A',
          present: Number(r.studentsPresent || 0),
          venue: r.venue || 'N/A',
          time: r.time || 'N/A',
        });
      });

      const result = Object.values(grouped).map(item => ({
        ...item,
        lectureCount: item.lectures.length,
      }));

      setData(result);
      setFiltered(result);
    } catch (e) {
      console.log('PRL Courses error:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (courseCode) => {
    setExpanded(expanded === courseCode ? null : courseCode);
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Courses</Text>
        <Text style={styles.headerSub}>All courses & lectures under your stream</Text>
      </View>

      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by course name, code, or lecturer..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length} course(s)</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, i) => i.toString()}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {search ? 'No matching courses' : 'No courses found'}
          </Text>
        }
        renderItem={({ item }) => {
          const isExpanded = expanded === item.courseCode;

          return (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => toggleExpand(item.courseCode)}
                activeOpacity={0.7}
              >
                <View style={styles.iconBox}>
                  <Text style={styles.iconEmoji}>📖</Text>
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.title}>
                    {item.courseName}{' '}
                    <Text style={styles.codeText}>({item.courseCode})</Text>
                  </Text>
                  <Text style={styles.subtitle}>
                    {item.className} · {item.lecturers.join(', ')}
                  </Text>
                </View>
                <View style={styles.lectureBadge}>
                  <Text style={styles.lectureBadgeText}>{item.lectureCount}</Text>
                </View>
                <Text style={[styles.arrow, isExpanded && styles.arrowUp]}>›</Text>
              </TouchableOpacity>

              {isExpanded && (
                <>
                  <View style={styles.divider} />

                  <View style={styles.courseStats}>
                    <View style={styles.courseStat}>
                      <Text style={styles.courseStatValue}>{item.totalStudents}</Text>
                      <Text style={styles.courseStatLabel}>Registered</Text>
                    </View>
                    <View style={styles.courseStat}>
                      <Text style={styles.courseStatValue}>{item.lecturers.length}</Text>
                      <Text style={styles.courseStatLabel}>Lecturer(s)</Text>
                    </View>
                  </View>

                  <Text style={styles.lecturesTitle}>Lectures:</Text>
                  {item.lectures.map((lec, i) => (
                    <View key={i} style={styles.lectureItem}>
                      <View style={styles.lectureDot} />
                      <View style={styles.lectureContent}>
                        <View style={styles.lectureTop}>
                          <Text style={styles.lectureWeek}>Week {lec.week}</Text>
                          <Text style={styles.lectureDate}>{lec.date}</Text>
                        </View>
                        <Text style={styles.lectureTopic} numberOfLines={1}>
                          {lec.topic}
                        </Text>
                        <View style={styles.lectureMeta}>
                          <Text style={styles.lectureMetaText}>
                            👤 {lec.lecturer}
                          </Text>
                          <Text style={styles.lectureMetaText}>
                            📍 {lec.venue}
                          </Text>
                          <Text style={styles.lectureMetaText}>
                            👥 {lec.present} present
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
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
  countRow: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  countText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  list: {
    padding: 16,
    paddingTop: 4,
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
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  codeText: {
    fontWeight: '400',
    color: '#64748B',
    fontSize: 13,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  lectureBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
  },
  lectureBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  arrow: {
    fontSize: 22,
    color: '#CBD5E1',
    fontWeight: '300',
    transform: [{ rotate: '90deg' }],
  },
  arrowUp: {
    transform: [{ rotate: '-90deg' }],
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  courseStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  courseStat: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  courseStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  courseStatLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  lecturesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  lectureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  lectureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginTop: 6,
    marginRight: 10,
  },
  lectureContent: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
  },
  lectureTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  lectureWeek: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  lectureDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  lectureTopic: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  lectureMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  lectureMetaText: {
    fontSize: 11,
    color: '#64748B',
  },
});