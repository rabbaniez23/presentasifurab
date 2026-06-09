import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [role, setRoleState] = useState<'user' | 'driver'>('user');
  const [vehicleType, setVehicleType] = useState<'motorcycle' | 'car'>('motorcycle');
  const [vehiclePlate, setVehiclePlate] = useState('');

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    if (role === 'driver' && !vehiclePlate) {
      Alert.alert('Validation Error', 'Please enter your vehicle plate number.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    
    // Simpan data di store untuk auto-login setelah sukses
    useAuthStore.getState().setRole(role);
    if (role === 'driver') {
      useAuthStore.getState().setVehicle({ plate: vehiclePlate, type: vehicleType });
    }
    
    // Simulasi loading pendaftaran
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Your account has been successfully created!', [
        {
          text: 'OK',
          onPress: () => {
            // Auto login setelah pendaftaran sukses
            useAuthStore.getState().setToken('dummy_jwt_token_for_testing');
            useAuthStore.getState().setUser({ contact: email, name: name });
            
            if (role === 'driver') {
              navigation.replace('DriverHome');
            } else {
              navigation.replace('Home');
            }
          }
        }
      ]);
    }, 800);
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.glassCard}>
          <Text style={styles.brandLabel}>Furab App</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to access premium microservices</Text>

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
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, nameFocused && styles.inputFocused]}
              placeholder="John Doe"
              placeholderTextColor={furapColors.neutral}
              value={name}
              onChangeText={setName}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
            />
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
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, passwordFocused && styles.inputFocused]}
              placeholder="Choose a strong password"
              placeholderTextColor={furapColors.neutral}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[styles.input, confirmPasswordFocused && styles.inputFocused]}
              placeholder="Repeat your password"
              placeholderTextColor={furapColors.neutral}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
            />
          </View>

          {/* Conditional Driver Fields */}
          {role === 'driver' && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Tipe Kendaraan</Text>
                <View style={styles.vehicleTypeSelector}>
                  <TouchableOpacity
                    style={[styles.vehicleTypeOption, vehicleType === 'motorcycle' && styles.vehicleTypeOptionActive]}
                    onPress={() => setVehicleType('motorcycle')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.vehicleTypeText, vehicleType === 'motorcycle' && styles.vehicleTypeTextActive]}>Motor</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.vehicleTypeOption, vehicleType === 'car' && styles.vehicleTypeOptionActive]}
                    onPress={() => setVehicleType('car')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.vehicleTypeText, vehicleType === 'car' && styles.vehicleTypeTextActive]}>Mobil</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Plat Kendaraan</Text>
                <TextInput
                  style={[styles.input, vehiclePlate.length > 0 && styles.inputFocused]}
                  placeholder="Misal: B 1234 ABC"
                  placeholderTextColor={furapColors.neutral}
                  value={vehiclePlate}
                  onChangeText={setVehiclePlate}
                  autoCapitalize="characters"
                />
              </View>
            </>
          )}

          <TouchableOpacity 
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={furapColors.onPrimary} size="small" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.loginText}>Already have an account? Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: furapColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  backgroundBlob1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#E9E8E7',
    opacity: 0.65,
    top: '5%',
    right: -60,
  },
  backgroundBlob2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#DFE0E0',
    opacity: 0.55,
    bottom: '5%',
    left: -70,
  },
  backgroundBlob3: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E3E2E2',
    opacity: 0.4,
    top: '35%',
    left: '10%',
  },
  glassCard: {
    ...furapGlass.card,
    paddingHorizontal: 24,
    paddingVertical: 32,
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
    marginBottom: 28,
    color: furapColors.secondary,
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
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    ...furapTypography.labelSm,
    marginBottom: 8,
    color: furapColors.primary,
  },
  input: {
    ...furapGlass.input,
    padding: 14,
  },
  inputFocused: {
    borderColor: furapColors.primary,
    backgroundColor: '#FFFFFF',
  },
  vehicleTypeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  vehicleTypeOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: furapColors.neutral,
    backgroundColor: 'transparent',
  },
  vehicleTypeOptionActive: {
    borderColor: furapColors.primary,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  vehicleTypeText: {
    ...furapTypography.bodyMd,
    color: furapColors.neutral,
  },
  vehicleTypeTextActive: {
    color: furapColors.primary,
    fontWeight: '600',
  },
  button: {
    ...furapGlass.buttonPrimary,
    marginTop: 12,
  },
  buttonText: {
    ...furapTypography.buttonText,
  },
  loginButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    ...furapTypography.bodyMd,
    fontWeight: '600',
    color: furapColors.primary,
    textDecorationLine: 'underline',
  }
});
