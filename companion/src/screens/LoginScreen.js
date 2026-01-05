import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Animated, useWindowDimensions, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getUser, ErrorTypes } from '../api/intra42';

export default function LoginScreen({ navigation }) {
  const [login, setLogin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const shakeAnimation = useState(new Animated.Value(0))[0];
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const isLandscape = width > height;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  const handleSearch = async () => {
    setError('');
    
    if (!login.trim()) {
      setError('Please enter a login');
      shake();
      return;
    }

    console.log('🔍 [LoginScreen] Searching for user:', login);
    setLoading(true);
    try {
      const user = await getUser(login);
      console.log('✅ [LoginScreen] User found:', user.login);
      setError('');
      navigation.navigate('Profile', { user });
    } catch (err) {
      console.error('❌ [LoginScreen] Error fetching user:', err);
      
      // Get appropriate error message based on error type
      let errorMessage = err.message || 'An unexpected error occurred';
      
      // Add helpful hints based on error type
      if (err.type === ErrorTypes.NETWORK_ERROR) {
        errorMessage = '📶 ' + errorMessage;
      } else if (err.type === ErrorTypes.USER_NOT_FOUND) {
        errorMessage = '🔍 ' + errorMessage;
      } else if (err.type === ErrorTypes.RATE_LIMITED) {
        errorMessage = '⏳ ' + errorMessage;
      } else if (err.type === ErrorTypes.SERVER_ERROR) {
        errorMessage = '🔧 ' + errorMessage;
      }
      
      setError(errorMessage);
      shake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.container, isLandscape && styles.containerLandscape]}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <Animated.View style={[
            styles.card, 
            { transform: [{ translateX: shakeAnimation }] },
            isLandscape && styles.cardLandscape,
            { maxWidth: Math.min(width * 0.9, 450) }
          ]}>
            <Text style={[styles.logo, isSmallScreen && styles.logoSmall]}>42</Text>
            <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>Swifty Companion</Text>
            <Text style={[styles.subtitle, isSmallScreen && styles.subtitleSmall]}>Search for a 42 student</Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <View style={styles.errorTextContainer}>
                <Text style={styles.errorTitle}>Oops!</Text>
                <Text style={styles.errorMessage}>{error}</Text>
              </View>
            </View>
          ) : null}
          
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter 42 login"
              placeholderTextColor="#9CA3AF"
              value={login}
              onChangeText={(text) => {
                setLogin(text);
                if (error) setError('');
              }}
              style={[styles.input, error && styles.inputError]}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSearch}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Search</Text>
            )}
          </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: '5%',
  },
  containerLandscape: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  cardLandscape: {
    padding: 24,
  },
  logo: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#00babc',
    textAlign: 'center',
    marginBottom: 8,
  },
  logoSmall: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 8,
  },
  titleSmall: {
    fontSize: 22,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 32,
  },
  subtitleSmall: {
    fontSize: 14,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 2,
  },
  errorMessage: {
    fontSize: 13,
    color: '#991B1B',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: { 
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  button: {
    backgroundColor: '#00babc',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00babc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
