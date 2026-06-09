import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, LogOut, Car, FileText, Star, Settings } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';

export default function DriverProfileScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const vehicle = useAuthStore((state) => state.vehicle);
  const logout = useAuthStore((state) => state.logout);

  const [goRideActive, setGoRideActive] = useState(true);
  const [goFoodActive, setGoFoodActive] = useState(true);

  const displayName = user?.name || user?.contact?.split('@')[0] || 'Driver';
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={furapColors.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Driver</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <View style={styles.ratingBadge}>
            <Star color={furapColors.warning} size={16} style={{ marginRight: 4 }} />
            <Text style={styles.ratingText}>4.9 (1,240 Trip)</Text>
          </View>
        </View>

        {/* Vehicle Info */}
        <Text style={styles.sectionTitle}>Info Kendaraan</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Car color={furapColors.neutral} size={20} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Tipe Kendaraan</Text>
              <Text style={styles.infoValue}>{vehicle?.type === 'car' ? 'Mobil' : 'Motor'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={{ width: 32 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Plat Nomor</Text>
              <Text style={styles.infoValue}>{vehicle?.plate || 'B 1234 ABC'}</Text>
            </View>
          </View>
        </View>

        {/* Documents */}
        <Text style={styles.sectionTitle}>Dokumen</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <FileText color={furapColors.neutral} size={20} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>SIM (Surat Izin Mengemudi)</Text>
              <Text style={styles.infoValue}>•••• 4567</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Terverifikasi</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={{ width: 32 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>STNK Kendaraan</Text>
              <Text style={styles.infoValue}>Valid hingga 2028</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Terverifikasi</Text>
            </View>
          </View>
        </View>

        {/* Services Configuration */}
        <Text style={styles.sectionTitle}>Pengaturan Layanan</Text>
        <View style={styles.infoCard}>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Terima Order GoRide</Text>
              <Text style={styles.switchDesc}>Antar jemput penumpang</Text>
            </View>
            <Switch
              value={goRideActive}
              onValueChange={setGoRideActive}
              trackColor={{ false: furapColors.neutral, true: furapColors.success }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Terima Order GoFood</Text>
              <Text style={styles.switchDesc}>Pesan antar makanan</Text>
            </View>
            <Switch
              value={goFoodActive}
              onValueChange={setGoFoodActive}
              trackColor={{ false: furapColors.neutral, true: furapColors.success }}
            />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut color={furapColors.error} size={20} style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: furapColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 30, 30, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...furapTypography.headingMd,
    color: furapColors.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: furapColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    ...furapTypography.displayMd,
    color: '#FFFFFF',
  },
  profileName: {
    ...furapTypography.headingLg,
    color: furapColors.primary,
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: {
    ...furapTypography.labelSm,
    color: furapColors.primary,
  },
  sectionTitle: {
    ...furapTypography.labelLg,
    color: furapColors.primary,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    ...furapTypography.bodySm,
    color: furapColors.neutral,
    marginBottom: 2,
  },
  infoValue: {
    ...furapTypography.labelMd,
    color: furapColors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 12,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    ...furapTypography.bodySm,
    fontSize: 10,
    color: furapColors.success,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  switchLabel: {
    ...furapTypography.labelMd,
    color: furapColors.primary,
  },
  switchDesc: {
    ...furapTypography.bodySm,
    color: furapColors.neutral,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  logoutBtnText: {
    ...furapTypography.labelMd,
    color: furapColors.error,
  }
});
