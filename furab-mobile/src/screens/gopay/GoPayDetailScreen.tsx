import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform 
} from 'react-native';
import { ChevronLeft, Plus, Send, ArrowUpRight, ArrowDownLeft, Shield, Wallet, CreditCard } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

export default function GoPayDetailScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const currentBalance = user?.balance ?? 150000;

  // Mock list of transactions specific to GoPay
  const gopayTransactions = [
    { id: '1', title: 'Top Up Gopay Mandiri', desc: 'Mandiri Virtual Account', amount: 100000, type: 'in', time: 'Hari ini, 09:15 AM' },
    { id: '2', title: 'Gourmet Bistro GoFood', desc: 'Pembayaran makanan', amount: 425000, type: 'out', time: 'Kemarin, 12:30 PM' },
    { id: '3', title: 'Ciwalk GoRide', desc: 'Pembayaran transportasi', amount: 18000, type: 'out', time: '2 hari lalu' },
    { id: '4', title: 'Transfer dari Budi', desc: 'Uang bensin', amount: 50000, type: 'in', time: '3 hari lalu' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GoPay</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Balance Display Card */}
        <View style={styles.balanceCard}>
          <View style={styles.cardHeader}>
            <Wallet color="#FFFFFF" size={20} />
            <Text style={styles.cardBrand}>GoPay Wallet</Text>
          </View>
          <Text style={styles.balanceText}>Rp {currentBalance.toLocaleString('id-ID')}</Text>
          <View style={styles.safeShieldRow}>
            <Shield color="#E8F5E9" size={14} style={{ marginRight: 6 }} />
            <Text style={styles.safeShieldText}>Saldo dilindungi dengan jaminan saldo kembali.</Text>
          </View>
        </View>

        {/* Action Panel */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('GoPayTopUp')}
          >
            <View style={styles.actionIconContainer}>
              <Plus color={furapColors.primary} size={22} />
            </View>
            <Text style={styles.actionLabel}>Isi Saldo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionBtn} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('GoPayTransfer')}
          >
            <View style={styles.actionIconContainer}>
              <Send color={furapColors.primary} size={22} />
            </View>
            <Text style={styles.actionLabel}>Bayar / Transfer</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Riwayat Transaksi GoPay</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('GoPayTransactionHistory')}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.historyCard}>
          {gopayTransactions.map((tx, index) => {
            const isIn = tx.type === 'in';
            return (
              <View key={tx.id}>
                <View style={styles.txRow}>
                  <View style={[styles.txIconWrapper, { backgroundColor: isIn ? '#E8F5E9' : '#FFEBEE' }]}>
                    {isIn ? (
                      <ArrowDownLeft color="#2E7D32" size={18} />
                    ) : (
                      <ArrowUpRight color="#C62828" size={18} />
                    )}
                  </View>
                  <View style={styles.txDetails}>
                    <Text style={styles.txTitle}>{tx.title}</Text>
                    <Text style={styles.txTime}>{tx.time} • {tx.desc}</Text>
                  </View>
                  <Text style={[styles.txAmount, { color: isIn ? '#2E7D32' : '#1A1A1A' }]}>
                    {isIn ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                  </Text>
                </View>
                {index < gopayTransactions.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: '#1E293B', // Dark Slate Blue for GoPay Card
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardBrand: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Manrope-Bold' : 'sans-serif-medium',
    marginLeft: 8,
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Manrope-Bold' : 'sans-serif-condensed',
    marginBottom: 16,
  },
  safeShieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safeShieldText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Manrope-Regular' : 'sans-serif',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(26,26,26,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    ...furapTypography.headlineMd,
    fontSize: 13,
    color: furapColors.primary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
  },
  seeAllText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    fontWeight: 'bold',
    color: furapColors.secondary,
  },
  historyCard: {
    ...furapGlass.card,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  txIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
  },
  txTime: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
    marginTop: 2,
  },
  txAmount: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});
