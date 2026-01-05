import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getUser } from '../api/intra42';

export default function LoginScreen({ navigation }) {
  const [login, setLogin] = useState('');

  const handleSearch = async () => {
    console.log('🔍 [LoginScreen] Searching for user:', login);
    try {
      const user = await getUser(login);
      console.log('✅ [LoginScreen] User found:', user.login);
      navigation.navigate('Profile', { user });
    } catch (err) {
      console.error('❌ [LoginScreen] Error fetching user:', err);
      Alert.alert('Error', 'User not found or network error');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter 42 login"
        value={login}
        onChangeText={setLogin}
        style={styles.input}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 },
});
