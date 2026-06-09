import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft } from 'lucide-react-native';

export default function OTPVerificationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const contact = route.params?.contact || 'demo@furab.com';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  // Timer countdown logic
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next box
    if (value.length > 0 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace when input is empty
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    setTimer(60);
    Alert.alert('OTP Sent', `A new verification code has been sent to ${contact}`);
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      Alert.alert('Verification Error', 'Please enter a complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    // Simulate API call to verification service
    setTimeout(() => {
      setLoading(false);
      setToken('dummy_jwt_token_for_testing');
      setUser({ contact: contact });
      navigation.replace('Home');
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

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <ArrowLeft color={furapColors.primary} size={24} />
      </TouchableOpacity>

      <View style={styles.glassCard}>
        <Text style={styles.brandLabel}>Furab Security</Text>
        <Text style={styles.title}>Enter OTP Code</Text>
        <Text style={styles.subtitle}>
          We have sent a 6-digit verification code to {contact}
        </Text>

        {/* OTP Input Boxes Grid */}
        <View style={styles.otpGrid}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(val) => handleOtpChange(val, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              textAlign="center"
              selectTextOnFocus
              placeholderTextColor={furapColors.neutral}
            />
          ))}
        </View>

        {/* Resend Timer section */}
        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend code in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResendOtp} activeOpacity={0.7}>
              <Text style={styles.resendText}>Resend OTP Code</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={handleVerify}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={furapColors.onPrimary} size="small" />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
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
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  glassCard: {
    ...furapGlass.card,
    paddingHorizontal: 20,
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
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    ...furapGlass.input,
    width: '14%',
    height: 52,
    paddingHorizontal: 0,
    fontSize: 22,
    fontWeight: 'bold',
    color: furapColors.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    ...furapTypography.bodyMd,
    color: furapColors.neutral,
  },
  resendText: {
    ...furapTypography.bodyMd,
    fontWeight: '600',
    color: furapColors.primary,
    textDecorationLine: 'underline',
  },
  button: {
    ...furapGlass.buttonPrimary,
    backgroundColor: furapColors.primary,
    marginTop: 8,
  },
  buttonText: {
    ...furapTypography.buttonText,
  },
});
