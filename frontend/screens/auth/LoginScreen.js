import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loginUser = async () => {
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        switch (role) {
          case "student": navigation.replace("StudentHome"); break;
          case "lecturer": navigation.replace("LecturerHome"); break;
          case "PRL": navigation.replace("PrincipalLecturerHome"); break;
          case "PL": navigation.replace("ProgramLeaderHome"); break;
          default: setError("Unknown role, contact admin.");
        }
      } else {
        setError("No user profile found. Please register again.");
      }
    } catch (error) {
      // Show Firebase error codes clearly
      console.log("Login error:", error.code, error.message);
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Try again.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex:1, justifyContent:'center', padding:20 }}>
      <Text style={{ fontSize:20, marginBottom:20 }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth:1, marginBottom:10, padding:8 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth:1, marginBottom:10, padding:8 }}
      />

      {error ? <Text style={{ color:'red', marginBottom:10 }}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={loginUser} />
      )}

      <View style={{ marginTop:20 }}>
        <Button title="Register" onPress={() => navigation.navigate("RegisterScreen")} />
      </View>
    </View>
  );
}
