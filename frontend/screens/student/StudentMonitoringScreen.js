import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
  Alert, SafeAreaView, Dimensions
} from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function StudentMonitoringScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [allLectures, setAllLectures] = useState([]);
  
  const [attendanceMap, setAttendanceMap] = useState({}); 
  const [ratingsMap, setRatingsMap] = useState({});
  
  const [stats, setStats] = useState({
    totalLectures: 0,
    presentCount: 0,
    attendancePercent: 0,
    ratedCount: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const lecturesQuery = query(collection(db, 'attendance'), orderBy('date', 'asc'));
      const lectureSnap = await getDocs(lecturesQuery);
      const lecturesData = lectureSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const attSnap = await getDocs(collection(db, 'studentAttendance'));
      const attData = attSnap.docs.map(doc => doc.data());

      const ratSnap = await getDocs(collection(db, 'ratings'));
      const ratData = ratSnap.docs.map(doc => doc.data());

      const attMap = {};
      attData.forEach(r => { if (r.lectureId) attMap[r.lectureId] = true; });

      const ratMap = {};
      ratData.forEach(r => { if (r.lectureId) ratMap[r.lectureId] = r.rating; });

      const total = lecturesData.length;
      const present = lecturesData.filter(l => attMap[l.id]).length;
      const rated = lecturesData.filter(l => ratMap[l.id]).length;
      const percent = total > 0 ? Math.round((present / total) * 100) : 0;

      setAllLectures(lecturesData);
      setAttendanceMap(attMap);
      setRatingsMap(ratMap);
      setStats({ totalLectures: total, presentCount: present, attendancePercent: percent, ratedCount: rated });

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignAttendance = async (lectureId, courseName, week) => {
    try {
      // Prepare the base data
      const attendanceData = {
        lectureId: lectureId,
        courseName: courseName,
        status: 'Present',
        date: new Date().toISOString().split('T')[0],
      };

      // ✅ FIX: Only add 'week' to the object if it is not undefined/null
      if (week) {
        attendanceData.week = week;
      }

      await addDoc(collection(db, 'studentAttendance'), attendanceData);

      // Optimistic UI Update
      const newAttMap = { ...attendanceMap };
      newAttMap[lectureId] = true;
      setAttendanceMap(newAttMap);

      const newPresent = stats.presentCount + 1;
      const newPercent = Math.round((newPresent / stats.totalLectures) * 100);
      setStats({ ...stats, presentCount: newPresent, attendancePercent: newPercent });

      Alert.alert("Success", "Attendance signed successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to sign attendance.");
    }
  };

  const handleRateLecture = (item) => {
    navigation.navigate('RatingScreen', { 
      lectureId: item.id, 
      courseCode: item.courseCode,
      courseName: item.courseName,
      lecturerName: item.lecturerName,
      topic: item.courseName
    });
  };

  const renderItem = ({ item }) => {
    const isPresent = attendanceMap[item.id];
    const hasRated = ratingsMap[item.id];

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.weekBadge}><Text style={styles.weekText}>Week {item.week || 'N/A'}</Text></View>
          <Text style={styles.dateText}>{item.date || 'No Date'}</Text>
        </View>
        
        <Text style={styles.courseCode}>{item.courseCode}</Text>
        <Text style={styles.topicText}>{item.courseName}</Text>
        <Text style={styles.lecturerText}>Lecturer: {item.lecturerName}</Text>

        <View style={styles.actionRow}>
          {isPresent ? (
            <View style={[styles.actionBtn, styles.presentBtn]}><Text style={styles.btnTextPresent}>✅ Present</Text></View>
          ) : (
            <TouchableOpacity 
              style={[styles.actionBtn, styles.signBtn]} 
              onPress={() => handleSignAttendance(item.id, item.courseName, item.week)}
            >
              <Text style={styles.btnTextSign}>✍️ Sign Attendance</Text>
            </TouchableOpacity>
          )}

          {hasRated ? (
            <View style={[styles.actionBtn, styles.ratedBtn]}><Text style={styles.btnTextRated}>⭐ Rated {hasRated}/5</Text></View>
          ) : (
            <TouchableOpacity 
              style={[styles.actionBtn, styles.rateBtn]} 
              onPress={() => handleRateLecture(item)}
            >
              <Text style={styles.btnTextRate}>Rate Lecture</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2563EB" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Dashboard</Text>
        <Text style={styles.headerSub}>Semester Progress</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { borderLeftColor: '#10B981' }]}>
          <Text style={styles.statValue}>{stats.attendancePercent}%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>
        <View style={[styles.statBox, { borderLeftColor: '#F59E0B' }]}>
          <Text style={styles.statValue}>{stats.ratedCount}</Text>
          <Text style={styles.statLabel}>Lectures Rated</Text>
        </View>
      </View>

      <Text style={styles.listTitle}>Lecture Schedule</Text>
      <FlatList
        data={allLectures}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No lectures found in database.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 14, color: '#64748B' },
  statsContainer: { flexDirection: 'row', padding: 16, gap: 12 },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 2, borderLeftWidth: 5 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  statLabel: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  listTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', paddingHorizontal: 20, marginTop: 10 },
  listContent: { padding: 16 },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  weekBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  weekText: { color: '#1E40AF', fontWeight: 'bold', fontSize: 12 },
  dateText: { color: '#64748B', fontSize: 12 },
  courseCode: { fontSize: 16, fontWeight: 'bold', color: '#334155', marginBottom: 4 },
  topicText: { fontSize: 14, color: '#64748B', marginBottom: 4 },
  lecturerText: { fontSize: 12, color: '#94A3B8', fontStyle: 'italic', marginBottom: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  signBtn: { backgroundColor: '#2563EB' }, rateBtn: { backgroundColor: '#F59E0B' },
  presentBtn: { backgroundColor: '#D1FAE5' }, ratedBtn: { backgroundColor: '#FEF3C7' },
  btnTextSign: { color: '#fff', fontWeight: '600', fontSize: 12 },
  btnTextRate: { color: '#fff', fontWeight: '600', fontSize: 12 },
  btnTextPresent: { color: '#065F46', fontWeight: '700', fontSize: 12 },
  btnTextRated: { color: '#92400E', fontWeight: '700', fontSize: 12 }
});