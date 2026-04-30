import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch role from Firestore to determine navigation
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        
        if (role === 'Lecturer') navigation.replace('LecturerHome');
        else if (role === 'Student') navigation.replace('StudentHome');
        else if (role === 'PRL') navigation.replace('PrincipalHome');
        else if (role === 'PL') navigation.replace('ProgramHome');
        else Alert.alert('Error', 'User role not defined');
      } else {
        Alert.alert('Error', 'User profile not found.');
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LUCT Reporting</Text>
      <TextInput placeholder="Email" style={styles.input} autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
      
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Login" onPress={handleLogin} />}
      
      <View style={{marginTop: 10}}>
          <Button title="Create Account" onPress={() => navigation.navigate('Register')} color="gray" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }
});