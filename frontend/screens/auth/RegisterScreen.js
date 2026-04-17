import { View, Text, Button, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const registerUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), { email, role });
      alert('Account created ✅');
      navigation.navigate('LoginScreen');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{ flex:1, justifyContent:'center', padding:20 }}>
      <Text>Register Screen</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth:1, marginBottom:10 }}/>
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth:1, marginBottom:10 }}/>
      <Picker selectedValue={role} onValueChange={(val) => setRole(val)}>
        <Picker.Item label="Student" value="student"/>
        <Picker.Item label="Lecturer" value="lecturer"/>
        <Picker.Item label="Principal Lecturer" value="PRL"/>
        <Picker.Item label="Program Leader" value="PL"/>
      </Picker>
      <Button title="Register" onPress={registerUser}/>
    </View>
  );
}
