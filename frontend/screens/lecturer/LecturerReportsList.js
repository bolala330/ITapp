import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function LecturerReportsList() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, "reports"), where("lecturerId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    });
    return () => unsubscribe();
  }, []);

  // Extra Credit: Search Functionality
  const filteredReports = reports.filter(item => 
    item.courseName.toLowerCase().includes(search.toLowerCase()) || 
    item.topic.toLowerCase().includes(search.toLowerCase()) ||
    item.date.includes(search)
  );

  // Extra Credit: Generate Downloadable Excel Report
  const downloadExcel = async () => {
    try {
      const ws = XLSX.utils.json_to_sheet(filteredReports);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Reports");
      
      // Generate base64
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      
      // Save to file
      const fileUri = FileSystem.documentDirectory + "LecturerReports.xlsx";
      await FileSystem.writeAsStringAsync(fileUri, wbout, { encoding: FileSystem.EncodingType.Base64 });
      
      // Share/Download
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert("Export Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Search (Course, Topic, Date)..." 
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={downloadExcel} style={styles.excelBtn}>
          <Text style={styles.excelText}>Excel</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredReports}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.courseTitle}>{item.courseName} ({item.courseCode})</Text>
            <Text style={styles.subText}>Date: {item.date} | Week: {item.week}</Text>
            <Text style={styles.topicText}>Topic: {item.topic}</Text>
            <Text style={styles.statText}>Attendance: {item.actualStudents}/{item.totalRegistered}</Text>
            {item.feedback ? <Text style={styles.feedback}>PRL Feedback: {item.feedback}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 10 },
  headerRow: { flexDirection: 'row', marginBottom: 10 },
  searchBar: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 8, marginRight: 10, borderWidth: 1, borderColor: '#ddd' },
  excelBtn: { backgroundColor: '#217346', padding: 10, borderRadius: 8, justifyContent: 'center', width: 70 },
  excelText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3 },
  courseTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  subText: { fontSize: 12, color: '#666', marginBottom: 4 },
  topicText: { fontSize: 14, fontStyle: 'italic', marginBottom: 4 },
  statText: { fontSize: 13, color: '#333', fontWeight: '500' },
  feedback: { marginTop: 5, color: 'blue', fontSize: 12 }
});