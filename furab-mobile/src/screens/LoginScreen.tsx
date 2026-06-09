import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [role, setRoleState] = useState<'user' | 'driver'>('user');

  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email or phone number.');
      return;
    }
    setLoading(true);
    const userEmail = email.trim();
    
    // Simpan role di authStore
    useAuthStore.getState().setRole(role);

    // Simulate API request to generate OTP, then navigate to verification
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('OTPVerification', { contact: userEmail, role: role });
    }, 400);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Decorative Blobs for Glassmorphic background depth */}
      <View style={styles.backgroundBlob1} />
      <View style={styles.backgroundBlob2} />
      <View style={styles.backgroundBlob3} />

      <View style={styles.glassCard}>
        <Text style={styles.brandLabel}>Furab App</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Enter your details to access your services</Text>

        {/* Role Selector */}
        <View style={styles.roleSelector}>
          <TouchableOpacity
            style={[styles.roleOption, role === 'user' && styles.roleOptionActive]}
            onPress={() => setRoleState('user')}
            activeOpacity={0.8}
          >
            <Text style={[styles.roleText, role === 'user' && styles.roleTextActive]}>Penumpang</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleOption, role === 'driver' && styles.roleOptionActive]}
            onPress={() => setRoleState('driver')}
            activeOpacity={0.8}
          >
            <Text style={[styles.roleText, role === 'driver' && styles.roleTextActive]}>Driver</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email or Phone</Text>
          <TextInput
            style={[styles.input, emailFocused && styles.inputFocused]}
            placeholder="name@domain.com"
            placeholderTextColor={furapColors.neutral}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password / OTP</Text>
          <TextInput
            style={[styles.input, passwordFocused && styles.inputFocused]}
            placeholder="Enter password or OTP"
            placeholderTextColor={furapColors.neutral}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={furapColors.onPrimary} size="small" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.7}
        >
          <Text style={styles.registerText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: furapColors.background,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backgroundBlob1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#E9E8E7',
    opacity: 0.65,
    top: '10%',
    right: -60,
  },
  backgroundBlob2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#DFE0E0',
    opacity: 0.55,
    bottom: '12%',
    left: -70,
  },
  backgroundBlob3: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E3E2E2',
    opacity: 0.4,
    top: '45%',
    left: '10%',
  },
  glassCard: {
    ...furapGlass.card,
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  brandLabel: {
    ...furapTypography.labelSm,
    marginBottom: 6,
    color: furapColors.neutral,
  },
  title: {
    ...furapTypography.displayLg,
    color: furapColors.primary,
  },
  subtitle: {
    ...furapTypography.bodyMd,
    marginTop: 6,
    marginBottom: 32,
    color: furapColors.secondary,
  },
  inputContainer: {
    marginBottom: 22,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 30,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  roleOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 26,
  },
  roleOptionActive: {
    backgroundColor: furapColors.primary,
  },
  roleText: {
    ...furapTypography.bodyMd,
    color: furapColors.neutral,
    fontWeight: '600',
  },
  roleTextActive: {
    color: furapColors.onPrimary,
  },
  label: {
    ...furapTypography.labelSm,
    marginBottom: 8,
    color: furapColors.primary,
  },
  input: {
    ...furapGlass.input,
  },
  inputFocused: {
    borderColor: furapColors.primary,
    backgroundColor: '#FFFFFF',
  },
  button: {
    ...furapGlass.buttonPrimary,
    marginTop: 16,
  },
  buttonText: {
    ...furapTypography.buttonText,
  },
  registerButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    ...furapTypography.bodyMd,
    fontWeight: '600',
    color: furapColors.primary,
    textDecorationLine: 'underline',
  }
});
