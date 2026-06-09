import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  ScrollView, 
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { ChevronLeft, Wallet, Plus, CreditCard, Banknote, QrCode, ChevronRight, Landmark } from 'lucide-react-native';

interface SavedMethod {
  id: string;
  bankName: string;
  cardNumber: string;
}

const SAVED_METHODS: SavedMethod[] = [
  { id: '1', bankName: 'Bank BCA', cardNumber: '•••• 5839' },
  { id: '2', bankName: 'Bank Mandiri', cardNumber: '•••• 9482' }
];

export default function PaymentMethodsScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);

  const handleAddMethod = () => {
    Alert.alert('Tambah Metode Baru', 'Fitur menambah kartu debit/kredit baru akan segera hadir!');
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
        <Text style={styles.headerTitle}>Metode Pembayaran</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* GoPay Balance Card */}
        <View style={styles.gopayCard}>
          <View style={styles.gopayHeader}>
            <View style={styles.gopayIconWrapper}>
              <Wallet color="#FFFFFF" size={18} />
            </View>
            <Text style={styles.gopayTitle}>GoPay</Text>
          </View>
          
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Saldo Aktif</Text>
            <Text style={styles.balanceText}>Rp {(user?.balance ?? 150000).toLocaleString('id-ID')}</Text>
          </View>

          <TouchableOpacity 
            style={styles.topupBtn}
            onPress={() => navigation.navigate('GoPayTopUp')}
            activeOpacity={0.8}
          >
            <Plus color={furapColors.primary} size={14} style={{ marginRight: 6 }} />
            <Text style={styles.topupBtnText}>Top Up</Text>
          </TouchableOpacity>
        </View>

        {/* Saved Methods Section */}
        <View style={styles.glassCard}>
          <Text style={styles.sectionTitle}>Metode Tersimpan</Text>
          
          {SAVED_METHODS.map((method) => (
            <View key={method.id} style={styles.methodRow}>
              <View style={styles.methodLeft}>
                <View style={styles.bankIconWrapper}>
                  <Landmark color={furapColors.primary} size={18} />
                </View>
                <View>
                  <Text style={styles.bankName}>{method.bankName}</Text>
                  <Text style={styles.cardNumber}>{method.cardNumber}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.manageBtn}
                onPress={() => Alert.alert('Detail Metode', `Mengelola kartu ${method.bankName}`)}
              >
                <Text style={styles.manageText}>Kelola</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Add New Method Button */}
          <TouchableOpacity 
            style={styles.addMethodBtn}
            onPress={handleAddMethod}
            activeOpacity={0.7}
          >
            <Plus color={furapColors.secondary} size={18} style={{ marginRight: 8 }} />
            <Text style={styles.addMethodText}>Tambah Metode Baru</Text>
          </TouchableOpacity>
        </View>

        {/* Other Options Section */}
        <View style={styles.glassCard}>
          <Text style={styles.sectionTitle}>Opsi Lainnya</Text>

          {/* Cash */}
          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIconWrapper, { backgroundColor: 'rgba(52, 199, 89, 0.08)' }]}>
                <Banknote color="#34C759" size={18} />
              </View>
              <View>
                <Text style={styles.optionName}>Tunai</Text>
                <Text style={styles.optionDesc}>Bayar langsung di tempat tujuan</Text>
              </View>
            </View>
            <View style={styles.activeLabel}>
              <Text style={styles.activeText}>Aktif</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* QRIS */}
          <TouchableOpacity 
            style={styles.optionRowClickable} 
            onPress={() => Alert.alert('Bayar QRIS', 'Fitur pemindaian QRIS akan segera hadir!')}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIconWrapper, { backgroundColor: 'rgba(0, 122, 255, 0.08)' }]}>
                <QrCode color="#007AFF" size={18} />
              </View>
              <View>
                <Text style={styles.optionName}>QRIS</Text>
                <Text style={styles.optionDesc}>Pindai barcode QRIS resmi Furab</Text>
              </View>
            </View>
            <ChevronRight color={furapColors.neutral} size={18} />
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
    top: '12%',
    right: -80,
  },
  backgroundBlob2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#E1E2E2',
    opacity: 0.4,
    bottom: '20%',
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
  gopayCard: {
    backgroundColor: furapColors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: furapColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  gopayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  gopayIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  gopayTitle: {
    ...furapTypography.headlineMd,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  balanceContainer: {
    marginBottom: 18,
  },
  balanceLabel: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  balanceText: {
    ...furapTypography.headlineMd,
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  topupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 12,
  },
  topupBtnText: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    fontWeight: 'bold',
    color: furapColors.primary,
  },
  glassCard: {
    ...furapGlass.card,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
    marginBottom: 16,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 26, 26, 0.05)',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(26, 26, 26, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bankName: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
    fontSize: 13,
  },
  cardNumber: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
  },
  manageBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(26, 26, 26, 0.05)',
  },
  manageText: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.secondary,
    fontWeight: 'bold',
  },
  addMethodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.15)',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  addMethodText: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    fontWeight: 'bold',
    color: furapColors.secondary,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionRowClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionName: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
    fontSize: 13,
  },
  optionDesc: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
  },
  activeLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(52, 199, 89, 0.08)',
  },
  activeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#34C759',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.05)',
  },
});
