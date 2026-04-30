import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase'; // Ensure this path is correct

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Password Error", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save User Data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role,
        createdAt: new Date()
      });

      Alert.alert("Success", "Account created. Please Login.");
      navigation.goBack();
    } catch (error) {
      console.error("Registration Error:", error); // Check Metro console for specific details
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Ionicons name="person-add-outline" size={60} color="#00d2ff" />
          <Text style={styles.title}>Create Account</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#64748b" style={styles.icon} />
            <TextInput 
              placeholder="Full Name" 
              style={styles.input} 
              value={name} 
              onChangeText={setName} 
              placeholderTextColor="#64748b"
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.icon} />
            <TextInput 
              placeholder="Email" 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail} 
              autoCapitalize="none"
              placeholderTextColor="#64748b"
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.icon} />
            <TextInput 
              placeholder="Password (min 6 chars)" 
              style={styles.input} 
              secureTextEntry 
              value={password} 
              onChangeText={setPassword}
              placeholderTextColor="#64748b"
            />
          </View>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={role}
              style={{ color: '#fff' }}
              dropdownIconColor="#fff"
              onValueChange={(itemValue) => setRole(itemValue)}
            >
              <Picker.Item label="Student" value="Student" />
              <Picker.Item label="Lecturer" value="Lecturer" />
              <Picker.Item label="Principal (PRL)" value="PRL" />
              <Picker.Item label="Program Leader (PL)" value="PL" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign Up</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
             <Text style={styles.loginLink}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 25 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  formContainer: { width: '100%' },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(30, 41, 59, 0.6)', 
    borderRadius: 12, 
    marginBottom: 15, 
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, color: '#fff' },
  pickerWrapper: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', // Center picker vertically on Android
    height: 55
  },
  btn: { backgroundColor: '#00d2ff', padding: 15, borderRadius: 12, alignItems: 'center', shadowColor: '#00d2ff', shadowOpacity: 0.4, shadowRadius: 10, elevation: 3 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loginLink: { color: '#94a3b8', textAlign: 'center', marginTop: 20, fontSize: 14 }
});