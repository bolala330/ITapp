import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, getAuth } from 'firebase/firestore';

export default function ClassesScreen() {
  const navigation = useNavigation();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const auth = getAuth();
    // Assuming you have a 'courses' collection with a 'lecturerId' field
    const q = query(collection(db, 'courses'), where('lecturerId', '==', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    setClasses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#059669" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Classes</Text>
      <FlatList
        data={classes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('StudentAttendanceScreen', { classId: item.id, className: item.name })}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.sub}>{item.code}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No classes assigned yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1E293B' },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  title: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  sub: { fontSize: 13, color: '#64748B', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 50, color: '#94A3B8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});