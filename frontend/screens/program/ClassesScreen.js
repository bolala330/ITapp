import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
// 1. IMPORT YOUR FIREBASE DB
import { db } from '../../services/firebase'; 
import { collection, getDocs } from 'firebase/firestore';

export default function PLClassesScreen() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      // 2. FETCH FROM 'attendance' COLLECTION (As shown in your image)
      const snap = await getDocs(collection(db, 'attendance'));
      const attendanceDocs = snap.docs.map(doc => doc.data());

      // 3. GROUP DATA BY courseCode (Because attendance is individual students, we group by Class)
      const grouped = {};
      
      attendanceDocs.forEach(doc => {
        const code = doc.courseCode || 'Unknown';
        if (!grouped[code]) {
          grouped[code] = {
            id: code, // Use courseCode as ID
            name: code,
            lecturer: doc.lecturerName || 'Not Assigned',
            count: 1, // Count of attendance records
          };
        } else {
          grouped[code].count++;
        }
      });

      const result = Object.values(grouped);
      setClasses(result);
    } catch (e) {
      console.log("Firebase Error:", e); // Check console for specific error
      Alert.alert("Error", "Could not load classes. Check internet or database rules.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#4F46E5" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Classes</Text>
        <Text style={styles.headerSub}>Loaded from 'attendance' collection</Text>
      </View>
      <FlatList
        data={classes}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.className}>{item.name}</Text>
            <View style={styles.row}>
               <Text style={styles.lecturer}>👨‍🏫 {item.lecturer}</Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.footer}>
              <Text style={styles.stat}>{item.count} Attendance Records</Text>
            </View>
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
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, borderLeftWidth: 4, borderLeftColor: '#10B981' },
  className: { fontSize: 17, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  lecturer: { fontSize: 13, color: '#4F46E5', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { fontSize: 12, fontWeight: '600', color: '#6B7280' }
});