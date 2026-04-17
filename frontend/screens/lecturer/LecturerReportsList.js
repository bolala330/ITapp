import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';
import { db } from '../../services/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export default function LecturerReportsList() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (search.trim() === '') { setFiltered(data); } 
    else {
      const q = search.toLowerCase();
      setFiltered(data.filter(item => 
        item.courseName?.toLowerCase().includes(q) || 
        item.topic?.toLowerCase().includes(q) ||
        item.date?.includes(q)
      ));
    }
  }, [search, data]);

  const loadData = async () => {
    try {
      // TODO: Replace 'Dr. Smith' with current logged-in user's name
      const q = query(collection(db, 'reports'), where('lecturerName', '==', 'Dr. Smith'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setFiltered(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.log(e); } finally { setLoading(false); }
  };

  // --- EXCEL EXPORT LOGIC (Extra Credit) ---
  const exportToExcel = useCallback(async () => {
    try {
      // Map data to flat structure for Excel
      const excelData = filtered.map(item => ({
        'Date': item.date,
        'Week': item.week,
        'Course Code': item.courseCode,
        'Course Name': item.courseName,
        'Topic Taught': item.topic,
        'Students Present': item.studentsPresent,
        'Total Registered': item.totalStudents,
        'Venue': item.venue,
        'Outcomes': item.outcomes,
        'Recommendations': item.recommendations
      }));

      // Create worksheet and workbook
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "My Reports");

      // Write file to device
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const uri = FileSystem.cacheDirectory + 'LUCT_Reports.xlsx';
      await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });

      // Share the file
      await Sharing.shareAsync(uri, { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', dialogTitle: 'Export Reports' });
    } catch (e) {
      Alert.alert("Export Error", "Could not generate file.");
      console.log(e);
    }
  }, [filtered]);

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#059669" />;

  return (
    <View style={styles.container}>
      {/* Header with Export Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reports</Text>
        <TouchableOpacity style={styles.exportBtn} onPress={exportToExcel}>
          <Text style={styles.exportText}>📥 Excel</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput style={styles.searchInput} placeholder="Search by topic, course..." value={search} onChangeText={setSearch} />
      </View>

      <FlatList 
        data={filtered} 
        keyExtractor={item => item.id} 
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.emptyText}>{search ? 'No matches found' : 'No reports submitted yet'}</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.courseName}>{item.courseName} ({item.courseCode})</Text>
              <Text style={styles.weekBadge}>W{item.week}</Text>
            </View>
            <Text style={styles.topic}>📝 {item.topic}</Text>
            <Text style={styles.meta}>📅 {item.date} | 📍 {item.venue}</Text>
            <Text style={styles.meta}>👥 Present: {item.studentsPresent} / {item.totalStudents}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' }, center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  exportBtn: { backgroundColor: '#059669', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  exportText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', margin: 16, marginBottom: 8, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 14, height: 48, elevation: 2 },
  searchIcon: { fontSize: 16, marginRight: 10 }, searchInput: { flex: 1, fontSize: 14, color: '#1E293B' },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 40 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 14, marginBottom: 12, elevation: 2, borderLeftWidth: 5, borderLeftColor: '#059669' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  courseName: { fontSize: 15, fontWeight: '700', color: '#0F172A', flex: 1 },
  weekBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontSize: 12, fontWeight: '800', color: '#065F46' },
  topic: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 4 },
  meta: { fontSize: 12, color: '#64748B', marginBottom: 2 }
});