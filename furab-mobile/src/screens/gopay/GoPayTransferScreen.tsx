import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Platform,
  Alert
} from 'react-native';
import { ChevronLeft, User, Phone, CheckCircle2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

export default function GoPayTransferScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  
  const currentBalance = user?.balance ?? 150000;
  const [recipient, setRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const presets = [10000, 20000, 50000, 100000];

  const handleTransfer = () => {
    if (recipient.trim() === '') {
      Alert.alert('Penerima Kosong', 'Silakan masukkan nomor telepon atau nama penerima.');
      return;
    }

    const amount = parseInt(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Jumlah Tidak Valid', 'Silakan masukkan jumlah transfer yang benar.');
      return;
    }

    if (amount > currentBalance) {
      Alert.alert('Saldo Tidak Cukup', 'Saldo GoPay Anda tidak mencukupi untuk melakukan transfer ini.');
      return;
    }

    const newBalance = currentBalance - amount;
    setUser({
      ...user,
      balance: newBalance
    });

    Alert.alert(
      'Transfer Berhasil',
      `Berhasil mentransfer Rp ${amount.toLocaleString('id-ID')} ke ${recipient}!`,
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transfer GoPay</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Recipient Input Card */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Penerima (Nomor HP / Nama)</Text>
          <View style={styles.inputFieldRow}>
            <User color={furapColors.neutral} size={18} style={{ marginRight: 10 }} />
            <TextInput
              style={styles.textInputField}
              placeholder="Contoh: 08123456789 atau Alex"
              placeholderTextColor="#A0A3A6"
              value={recipient}
              onChangeText={setRecipient}
            />
          </View>
        </View>

        {/* Amount Input Card */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Masukkan Jumlah Transfer</Text>
          <View style={styles.currencyRow}>
            <Text style={styles.currencyPrefix}>Rp</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor="#A0A3A6"
              value={transferAmount}
              onChangeText={setTransferAmount}
            />
          </View>
          <View style={styles.balanceInfoRow}>
            <Text style={styles.balanceInfoText}>
              Saldo aktif Anda: **Rp {currentBalance.toLocaleString('id-ID')}**
            </Text>
          </View>
        </View>

        {/* Preset Amounts Grid */}
        <Text style={styles.sectionTitle}>Pilih Cepat</Text>
        <View style={styles.presetGrid}>
          {presets.map((val) => (
            <TouchableOpacity 
              key={val} 
              style={[
                styles.presetBtn, 
                parseInt(transferAmount) === val && styles.presetBtnActive
              ]}
              onPress={() => setTransferAmount(val.toString())}
            >
              <Text style={[
                styles.presetText, 
                parseInt(transferAmount) === val && styles.presetTextActive
              ]}>
                Rp {val.toLocaleString('id-ID')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleTransfer}>
          <Text style={styles.submitBtnText}>Kirim Saldo Sekarang</Text>
        </TouchableOpacity>
      </View>
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
  inputFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 26, 26, 0.08)',
    paddingBottom: 6,
  },
  textInputField: {
    flex: 1,
    ...furapTypography.bodyMd,
    fontSize: 14,
    color: furapColors.primary,
    padding: 0,
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
  balanceInfoRow: {
    marginTop: 10,
  },
  balanceInfoText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Manrope-Regular' : 'sans-serif',
    color: furapColors.secondary,
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
    width: '23%',
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
    fontSize: 11,
    color: furapColors.secondary,
  },
  presetTextActive: {
    color: furapColors.primary,
  },
  submitBtn: {
    ...furapGlass.buttonPrimary,
    backgroundColor: furapColors.primary,
    width: '100%',
    paddingVertical: 14,
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  submitBtnText: {
    ...furapTypography.buttonText,
    color: '#FFFFFF',
    fontSize: 15,
  },
});
