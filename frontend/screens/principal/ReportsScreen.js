import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function ReportsScreen() {
  const [reports, setReports] = useState([]);
  const [feedbackMap, setFeedbackMap] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      const snapshot = await getDocs(collection(db, "reports"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    };
    fetchReports();
  }, []);

  const handleAddFeedback = async (reportId) => {
    const feedback = feedbackMap[reportId];
    if (!feedback) return;

    try {
      await updateDoc(doc(db, "reports", reportId), { feedback: feedback });
      Alert.alert("Success", "Feedback added.");
      // Clear input locally (simplified)
      setFeedbackMap(prev => ({ ...prev, [reportId]: '' }));
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Lecturer Reports (PRL View)</Text>
      <FlatList
        data={reports}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.bold}>{item.courseName} - {item.lecturerName}</Text>
            <Text>Topic: {item.topic}</Text>
            <Text>Recommendations: {item.recommendations}</Text>
            
            {item.feedback ? (
               <Text style={styles.existFeedback}>Existing Feedback: {item.feedback}</Text>
            ) : (
               <View>
                 <TextInput
                   style={styles.input}
                   placeholder="Add Feedback"
                   value={feedbackMap[item.id] || ''}
                   onChangeText={text => setFeedbackMap(prev => ({ ...prev, [item.id]: text }))}
                 />
                 <Button title="Submit Feedback" onPress={() => handleAddFeedback(item.id)} />
               </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  card: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10 },
  bold: { fontWeight: 'bold', fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginTop: 5, marginBottom: 5 },
  existFeedback: { color: 'green', marginTop: 5, fontStyle: 'italic' }
});