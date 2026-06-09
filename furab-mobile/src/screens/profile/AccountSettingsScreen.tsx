import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Platform, 
  ScrollView, 
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { ChevronLeft, Camera, Shield, Key, AlertCircle, ChevronRight, User } from 'lucide-react-native';

export default function AccountSettingsScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  // Fallback defaults
  const initialContact = user?.contact || 'alex@furab.com';
  const isEmailContact = initialContact.includes('@');
  const defaultName = user?.name || (isEmailContact ? initialContact.split('@')[0] : 'Alex');
  const displayDefaultName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

  const initialEmail = user?.email || (isEmailContact ? initialContact : 'alex@furab.com');
  const initialPhone = user?.phone || (!isEmailContact ? initialContact : '+62 812-3456-7890');
  const initialDob = user?.dob || '1995-08-20';

  // Form states
  const [fullName, setFullName] = useState(user?.name || displayDefaultName);
  const [email, setEmail] = useState(initialEmail);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [dob, setDob] = useState(initialDob);

  const handleSave = () => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Nama lengkap tidak boleh kosong.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validation Error', 'Format email tidak valid.');
      return;
    }

    setUser({
      ...user,
      name: fullName,
      email: email,
      phone: phoneNumber,
      dob: dob
    });

    Alert.alert('Sukses', 'Perubahan akun berhasil disimpan!');
  };

  const handleDeactivate = () => {
    Alert.alert(
      'Konfirmasi Nonaktifkan Akun',
      'Apakah Anda yakin ingin menonaktifkan akun Furab Anda? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'NONAKTIFKAN', 
          style: 'destructive',
          onPress: () => {
            logout();
            Alert.alert(
              'Akun Dinonaktifkan',
              'Akun Anda telah dinonaktifkan. Anda akan diarahkan ke halaman login.',
              [{ text: 'OK', onPress: () => navigation.replace('Login') }]
            );
          }
        }
      ]
    );
  };

  const handleEditAvatar = () => {
    Alert.alert('Ubah Avatar', 'Fitur ubah foto profil akan segera hadir!');
  };

  return (
    <View style={styles.container}>
      {/* Background Blobs */}
      <View style={styles.backgroundBlob1} />
      <View style={styles.backgroundBlob2} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan Akun</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarInner}>
              <User color={furapColors.primary} size={50} />
            </View>
            <TouchableOpacity 
              style={styles.editAvatarBtn} 
              onPress={handleEditAvatar}
              activeOpacity={0.8}
            >
              <Camera color="#FFFFFF" size={14} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Editable Form Card */}
        <View style={styles.glassCard}>
          <Text style={styles.cardSectionTitle}>Informasi Pribadi</Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nama Lengkap</Text>
            <TextInput 
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor={furapColors.neutral}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput 
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="name@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={furapColors.neutral}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>No. Telepon</Text>
            <TextInput 
              style={styles.textInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+62xxxx"
              keyboardType="phone-pad"
              placeholderTextColor={furapColors.neutral}
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tanggal Lahir</Text>
            <TextInput 
              style={styles.textInput}
              value={dob}
              onChangeText={setDob}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={furapColors.neutral}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveBtn} 
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <View style={styles.glassCard}>
          <Text style={styles.cardSectionTitle}>Keamanan</Text>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => Alert.alert('Ubah Password', 'Fitur ubah password akan segera hadir.')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Key color={furapColors.primary} size={18} style={{ marginRight: 12 }} />
              <Text style={styles.menuItemText}>Ubah Password</Text>
            </View>
            <ChevronRight color={furapColors.neutral} size={18} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => Alert.alert('Verifikasi 2 Langkah', 'Fitur keamanan 2 langkah akan segera hadir.')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Shield color={furapColors.primary} size={18} style={{ marginRight: 12 }} />
              <Text style={styles.menuItemText}>Verifikasi 2 Langkah</Text>
            </View>
            <ChevronRight color={furapColors.neutral} size={18} />
          </TouchableOpacity>
        </View>

        {/* Danger Zone Section */}
        <View style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Zona Bahaya</Text>
          <TouchableOpacity 
            style={styles.deactivateBtn} 
            onPress={handleDeactivate}
            activeOpacity={0.7}
          >
            <AlertCircle color={furapColors.error} size={18} style={{ marginRight: 10 }} />
            <Text style={styles.deactivateBtnText}>Nonaktifkan Akun</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: furapColors.background,
  },
  backgroundBlob1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#EAEAE9',
    opacity: 0.4,
    top: '10%',
    right: -80,
  },
  backgroundBlob2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#E1E2E2',
    opacity: 0.4,
    bottom: '15%',
    left: -80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...furapTypography.headlineMd,
    fontSize: 18,
    color: furapColors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(26, 26, 26, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: furapColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 2,
  },
  glassCard: {
    ...furapGlass.card,
    padding: 16,
    marginBottom: 20,
  },
  cardSectionTitle: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    fontWeight: '600',
    color: furapColors.secondary,
    marginBottom: 6,
  },
  textInput: {
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.08)',
    ...furapTypography.bodyMd,
    color: furapColors.primary,
    fontSize: 13,
  },
  saveBtn: {
    ...furapGlass.buttonPrimary,
    backgroundColor: furapColors.primary,
    marginTop: 10,
  },
  saveBtnText: {
    ...furapTypography.buttonText,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.05)',
  },
  dangerCard: {
    ...furapGlass.card,
    borderColor: 'rgba(255, 59, 48, 0.15)',
    padding: 16,
    marginBottom: 20,
  },
  dangerTitle: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.error,
    marginBottom: 14,
  },
  deactivateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  deactivateBtnText: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    fontWeight: 'bold',
    color: furapColors.error,
  },
});
