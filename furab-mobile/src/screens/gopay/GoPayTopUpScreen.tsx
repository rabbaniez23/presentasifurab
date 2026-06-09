import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import { ChevronLeft, Landmark, QrCode, ChevronRight, Copy, CheckCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

type BankType = 'BCA' | 'Mandiri' | 'BRI' | 'BNI';

export default function GoPayTopUpScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  
  const currentBalance = user?.balance ?? 150000;
  
  // States
  const [step, setStep] = useState<'input' | 'detail'>('input');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'qris'>('bank');
  const [selectedBank, setSelectedBank] = useState<BankType>('BCA');

  const presets = [10000, 20000, 50000, 100000, 200000, 500000];

  const handleNextStep = () => {
    const amount = parseInt(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Jumlah Tidak Valid', 'Silakan masukkan jumlah pengisian saldo yang benar.');
      return;
    }

    if (amount < 10000) {
      Alert.alert('Batas Minimum', 'Minimal pengisian saldo GoPay adalah Rp 10.000.');
      return;
    }

    setStep('detail');
  };

  const handleCompletePayment = () => {
    const amount = parseInt(topUpAmount);
    const newBalance = currentBalance + amount;
    
    setUser({
      ...user,
      balance: newBalance
    });

    Alert.alert(
      'Pembayaran Sukses',
      `Saldo sebesar Rp ${amount.toLocaleString('id-ID')} telah ditambahkan ke GoPay Anda.`,
      [
        { text: 'Selesai', onPress: () => navigation.navigate('GoPayDetail') }
      ]
    );
  };

  const getVANumber = () => {
    const phoneSuffix = user?.phoneNumber ? user.phoneNumber.replace(/[^0-9]/g, '').slice(-10) : '8123456789';
    switch (selectedBank) {
      case 'BCA': return `70001${phoneSuffix}`;
      case 'Mandiri': return `60877${phoneSuffix}`;
      case 'BRI': return `88012${phoneSuffix}`;
      case 'BNI': return `88100${phoneSuffix}`;
      default: return `80010${phoneSuffix}`;
    }
  };

  const copyToClipboard = () => {
    Alert.alert('Disalin', 'Nomor Virtual Account berhasil disalin ke papan klip.');
  };

  if (step === 'detail') {
    const amountVal = parseInt(topUpAmount) || 0;
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep('input')}>
            <ChevronLeft color={furapColors.primary} size={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Instruksi Pembayaran</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
          {selectedMethod === 'bank' ? (
            <View style={styles.detailCard}>
              <View style={styles.bankHeaderRow}>
                <View style={styles.bankBadge}>
                  <Text style={styles.bankBadgeText}>{selectedBank}</Text>
                </View>
                <Text style={styles.bankTitleText}>{selectedBank} Virtual Account</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.detailLabel}>Nomor Virtual Account</Text>
              <View style={styles.vaRow}>
                <Text style={styles.vaNumber}>{getVANumber()}</Text>
                <TouchableOpacity style={styles.copyBtn} onPress={copyToClipboard}>
                  <Copy color={furapColors.primary} size={16} />
                  <Text style={styles.copyBtnText}>Salin</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <Text style={styles.detailLabel}>Total Pembayaran</Text>
              <Text style={styles.detailAmount}>Rp {amountVal.toLocaleString('id-ID')}</Text>
              
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxTitle}>Cara Pembayaran:</Text>
                <Text style={styles.infoBoxText}>1. Buka aplikasi Mobile Banking {selectedBank} Anda.</Text>
                <Text style={styles.infoBoxText}>2. Pilih menu Transfer atau Virtual Account.</Text>
                <Text style={styles.infoBoxText}>3. Masukkan nomor VA di atas.</Text>
                <Text style={styles.infoBoxText}>4. Masukkan nominal bayar persis Rp {amountVal.toLocaleString('id-ID')}.</Text>
                <Text style={styles.infoBoxText}>5. Konfirmasi PIN dan selesaikan transaksi.</Text>
              </View>
            </View>
          ) : (
            <View style={styles.detailCard}>
              <View style={styles.qrisHeaderRow}>
                <View style={styles.qrisLogoContainer}>
                  <Text style={styles.qrisLogoText}>QRIS</Text>
                </View>
                <Text style={styles.bankTitleText}>Scan QR Code</Text>
              </View>

              <View style={styles.divider} />

              {/* Simulated QR Code */}
              <View style={styles.qrCodeWrapper}>
                <View style={styles.qrOuter}>
                  <View style={styles.qrInner}>
                    <QrCode color={furapColors.primary} size={150} />
                  </View>
                </View>
                <Text style={styles.qrHint}>Pindai QR ini menggunakan aplikasi pembayaran favorit Anda.</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.detailLabel}>Total Pembayaran</Text>
              <Text style={styles.detailAmount}>Rp {amountVal.toLocaleString('id-ID')}</Text>
            </View>
          )}

          {/* Pay Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleCompletePayment}>
            <Text style={styles.submitBtnText}>Saya Sudah Bayar / Transfer</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Isi Saldo GoPay</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Input Card */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Masukkan Jumlah Pengisian</Text>
          <View style={styles.currencyRow}>
            <Text style={styles.currencyPrefix}>Rp</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor="#A0A3A6"
              value={topUpAmount}
              onChangeText={setTopUpAmount}
              autoFocus
            />
          </View>
        </View>

        {/* Preset Amounts Grid */}
        <Text style={styles.sectionTitle}>Pilih Jumlah Instan</Text>
        <View style={styles.presetGrid}>
          {presets.map((val) => (
            <TouchableOpacity 
              key={val} 
              style={[
                styles.presetBtn, 
                parseInt(topUpAmount) === val && styles.presetBtnActive
              ]}
              onPress={() => setTopUpAmount(val.toString())}
            >
              <Text style={[
                styles.presetText, 
                parseInt(topUpAmount) === val && styles.presetTextActive
              ]}>
                Rp {val.toLocaleString('id-ID')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Method Selectors */}
        <Text style={styles.sectionTitle}>Pilih Metode Pengisian</Text>
        
        {/* Bank Transfer VA */}
        <TouchableOpacity 
          style={[styles.methodCard, selectedMethod === 'bank' && styles.methodCardActive]}
          onPress={() => setSelectedMethod('bank')}
        >
          <Landmark color={furapColors.primary} size={20} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.methodName}>Transfer Bank / Virtual Account</Text>
            <Text style={styles.methodDesc}>Instan via Mobile Banking atau ATM</Text>
          </View>
        </TouchableOpacity>

        {/* Bank selection items (Only show if bank selected) */}
        {selectedMethod === 'bank' && (
          <View style={styles.bankSelectionWrapper}>
            {(['BCA', 'Mandiri', 'BRI', 'BNI'] as BankType[]).map((bank) => (
              <TouchableOpacity 
                key={bank}
                style={[
                  styles.bankOptionItem,
                  selectedBank === bank && styles.bankOptionItemActive
                ]}
                onPress={() => setSelectedBank(bank)}
              >
                <View style={styles.bankOptionIndicator}>
                  <View style={[styles.bankOptionIndicatorInner, selectedBank === bank && { backgroundColor: furapColors.primary }]} />
                </View>
                <Text style={[styles.bankOptionText, selectedBank === bank && styles.bankOptionTextActive]}>
                  {bank} Virtual Account
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* QRIS Code */}
        <TouchableOpacity 
          style={[styles.methodCard, selectedMethod === 'qris' && styles.methodCardActive]}
          onPress={() => setSelectedMethod('qris')}
        >
          <QrCode color={furapColors.primary} size={20} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.methodName}>QRIS</Text>
            <Text style={styles.methodDesc}>Scan dengan ShopeePay, OVO, Dana, dll.</Text>
          </View>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleNextStep}>
          <Text style={styles.submitBtnText}>Konfirmasi Pengisian</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 26, 26, 0.06)',
    zIndex: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...furapTypography.headlineMd,
    fontSize: 18,
    color: furapColors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputCard: {
    ...furapGlass.card,
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  inputLabel: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
    marginBottom: 8,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyPrefix: {
    fontSize: 24,
    fontWeight: '800',
    color: furapColors.primary,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '800',
    color: furapColors.primary,
    padding: 0,
  },
  sectionTitle: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
    marginBottom: 10,
    marginLeft: 4,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 20,
  },
  presetBtn: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1%',
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.05)',
  },
  presetBtnActive: {
    borderColor: furapColors.primary,
    backgroundColor: 'rgba(26, 26, 26, 0.05)',
  },
  presetText: {
    ...furapTypography.headlineMd,
    fontSize: 12,
    color: furapColors.secondary,
  },
  presetTextActive: {
    color: furapColors.primary,
  },
  methodCard: {
    ...furapGlass.card,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  methodCardActive: {
    borderColor: furapColors.primary,
  },
  methodName: {
    ...furapTypography.headlineMd,
    fontSize: 13,
    color: furapColors.primary,
  },
  methodDesc: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
    marginTop: 2,
  },
  bankSelectionWrapper: {
    backgroundColor: 'rgba(26, 26, 26, 0.02)',
    borderRadius: 12,
    padding: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.05)',
  },
  bankOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bankOptionItemActive: {
    backgroundColor: '#FFFFFF',
  },
  bankOptionIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: furapColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bankOptionIndicatorInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bankOptionText: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.secondary,
  },
  bankOptionTextActive: {
    color: furapColors.primary,
    fontWeight: 'bold',
  },
  submitBtn: {
    ...furapGlass.buttonPrimary,
    backgroundColor: furapColors.primary, // Consistent Black
    width: '100%',
    paddingVertical: 14,
    marginTop: 24,
    marginBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  submitBtnText: {
    ...furapTypography.buttonText,
    color: '#FFFFFF',
    fontSize: 15,
  },

  // Detail & VA styles
  detailCard: {
    ...furapGlass.card,
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 8,
  },
  bankHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankBadge: {
    backgroundColor: furapColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  bankBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  bankTitleText: {
    ...furapTypography.headlineMd,
    fontSize: 15,
    color: furapColors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.08)',
    marginVertical: 16,
  },
  detailLabel: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
    marginBottom: 6,
  },
  vaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(26, 26, 26, 0.03)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  vaNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: furapColors.primary,
    letterSpacing: 1,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.1)',
  },
  copyBtnText: {
    ...furapTypography.headlineMd,
    fontSize: 11,
    color: furapColors.primary,
    marginLeft: 4,
  },
  detailAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: furapColors.primary,
  },
  infoBox: {
    backgroundColor: 'rgba(26, 26, 26, 0.02)',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  infoBoxTitle: {
    ...furapTypography.headlineMd,
    fontSize: 12,
    color: furapColors.primary,
    marginBottom: 8,
  },
  infoBoxText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.secondary,
    lineHeight: 18,
    marginBottom: 4,
  },

  // QRIS simulation styles
  qrisHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrisLogoContainer: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  qrisLogoText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  qrCodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  qrOuter: {
    borderWidth: 2,
    borderColor: 'rgba(26, 26, 26, 0.1)',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  qrInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrHint: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
});
