import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  Switch, 
  Alert, 
  ScrollView 
} from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../theme/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, ShieldAlert, PhoneCall, MapPin, Shield } from 'lucide-react-native';

interface Contact {
  name: string;
  phone: string;
  desc: string;
}

const EMERGENCY_CONTACTS: Contact[] = [
  { name: 'Polisi', phone: '110', desc: 'Bantuan keamanan & darurat kriminal' },
  { name: 'Ambulans / Kemenkes', phone: '118', desc: 'Bantuan medis & pertolongan pertama' },
  { name: 'Pemadam Kebakaran', phone: '113', desc: 'Bantuan kebakaran & evakuasi penyelamatan' }
];

export default function EmergencySOSScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Params
  const { service, driverName, orderId } = route.params || {};

  // Local state
  const [shareLocation, setShareLocation] = useState(true);

  const handleSOSPress = () => {
    Alert.alert(
      'Konfirmasi SOS Darurat',
      'Apakah Anda sedang dalam bahaya dan membutuhkan bantuan segera? Pihak keamanan Furab akan mendeteksi koordinat lokasi Anda.',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'YA, SAYA BUTUH BANTUAN', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'SOS Terkirim',
              'Laporan darurat Anda telah sukses terkirim ke pihak berwajib dan tim tanggap darurat Furab. Petugas sedang melacak lokasi terkini Anda.'
            );
          }
        }
      ]
    );
  };

  const handleCallSimulate = (contact: Contact) => {
    Alert.alert(
      'Simulasi Panggilan',
      `Menghubungi nomor darurat ${contact.name} (${contact.phone})?`,
      [
        { text: 'Batal' },
        { text: 'Panggil', onPress: () => Alert.alert('Panggilan Tersambung', `Menghubungi ${contact.phone}...`) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Blobs */}
      <View style={styles.backgroundBlob1} />
      <View style={styles.backgroundBlob2} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft color={furapColors.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pusat Keselamatan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Active Trip Info Box */}
        {service && (
          <View style={styles.activeTripCard}>
            <View style={styles.tripHeader}>
              <Shield color={furapColors.error} size={18} style={{ marginRight: 8 }} />
              <Text style={styles.tripTitle}>Perjalanan Aktif Terdeteksi</Text>
            </View>
            <View style={styles.tripDetails}>
              <Text style={styles.tripText}>Layanan: <Text style={styles.boldText}>{service}</Text></Text>
              <Text style={styles.tripText}>Order ID: <Text style={styles.boldText}>{orderId}</Text></Text>
              {driverName && <Text style={styles.tripText}>Driver: <Text style={styles.boldText}>{driverName}</Text></Text>}
            </View>
          </View>
        )}

        {/* SOS Button Center Area */}
        <View style={styles.sosCenterArea}>
          <TouchableOpacity 
            style={styles.sosButton} 
            onPress={handleSOSPress}
            activeOpacity={0.8}
          >
            <ShieldAlert color="#FFFFFF" size={54} />
            <Text style={styles.sosButtonText}>SOS</Text>
          </TouchableOpacity>
          <Text style={styles.sosSubtitle}>Tekan jika darurat</Text>
          <Text style={styles.sosWarning}>Tim Furab dan otoritas berwajib akan segera merespons setelah tombol ditekan.</Text>
        </View>

        {/* Share Location Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleLeft}>
            <MapPin color={furapColors.primary} size={20} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Bagikan Lokasi Terkini</Text>
              <Text style={styles.toggleDesc}>Kirim koordinat GPS Anda secara real-time ke kontak darurat.</Text>
            </View>
          </View>
          <Switch 
            value={shareLocation}
            onValueChange={setShareLocation}
            trackColor={{ false: '#D1D1D6', true: '#FF3B30' }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        {/* Emergency Contacts List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hubungi Kontak Darurat</Text>
          {EMERGENCY_CONTACTS.map((contact, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactItem}
              onPress={() => handleCallSimulate(contact)}
              activeOpacity={0.7}
            >
              <View style={styles.contactLeft}>
                <View style={styles.phoneIconWrapper}>
                  <PhoneCall color={furapColors.error} size={18} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactName}>{contact.name} ({contact.phone})</Text>
                  <Text style={styles.contactDesc} numberOfLines={1}>{contact.desc}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    backgroundColor: 'rgba(255, 59, 48, 0.06)',
    top: '10%',
    right: -60,
  },
  backgroundBlob2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 59, 48, 0.04)',
    bottom: '15%',
    left: -60,
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
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  headerTitle: {
    ...furapTypography.headlineMd,
    color: furapColors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  activeTripCard: {
    ...furapGlass.card,
    backgroundColor: 'rgba(255, 59, 48, 0.06)',
    borderColor: 'rgba(255, 59, 48, 0.15)',
    padding: 14,
    marginBottom: 24,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripTitle: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.error,
  },
  tripDetails: {
    paddingLeft: 26,
  },
  tripText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.primary,
    marginBottom: 2,
  },
  boldText: {
    fontWeight: 'bold',
  },
  sosCenterArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  sosButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    marginBottom: 16,
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 4,
  },
  sosSubtitle: {
    ...furapTypography.headlineMd,
    fontSize: 18,
    color: furapColors.primary,
    marginBottom: 8,
  },
  sosWarning: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 16,
  },
  toggleCard: {
    ...furapGlass.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 20,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  toggleTitle: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
    fontSize: 13,
  },
  toggleDesc: {
    ...furapTypography.bodyMd,
    fontSize: 10,
    color: furapColors.neutral,
  },
  section: {
    ...furapGlass.card,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
    marginBottom: 14,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 26, 26, 0.05)',
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  phoneIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactName: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
    fontSize: 13,
  },
  contactDesc: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
  },
});
