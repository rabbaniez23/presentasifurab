import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Wallet, ArrowUpRight, ArrowDownLeft, Car, Pizza } from 'lucide-react-native';

const mockTransactions = [
  { id: '1', type: 'goride', title: 'GoRide - Budi Santoso', time: 'Hari ini, 14:30', amount: 18000, isCredit: true },
  { id: '2', type: 'gofood', title: 'GoFood - Ayam Geprek', time: 'Hari ini, 12:15', amount: 24000, isCredit: true },
  { id: '3', type: 'withdraw', title: 'Tarik Saldo ke BCA', time: 'Kemarin, 18:00', amount: 500000, isCredit: false },
  { id: '4', type: 'goride', title: 'GoRide - Siti Aminah', time: 'Kemarin, 09:00', amount: 22000, isCredit: true },
  { id: '5', type: 'goride', title: 'GoRide - Andi Wijaya', time: 'Senin, 16:45', amount: 15000, isCredit: true },
  { id: '6', type: 'gofood', title: 'GoFood - Martabak Manis', time: 'Senin, 19:30', amount: 12000, isCredit: true },
  { id: '7', type: 'goride', title: 'GoRide - Rina Sari', time: 'Minggu, 10:20', amount: 28000, isCredit: true },
  { id: '8', type: 'gofood', title: 'GoFood - Kopi Kenangan', time: 'Minggu, 14:10', amount: 10000, isCredit: true },
];

const mockChartData = [
  { day: 'Sen', amount: 120, height: 60 },
  { day: 'Sel', amount: 180, height: 90 },
  { day: 'Rab', amount: 150, height: 75 },
  { day: 'Kam', amount: 210, height: 100 },
  { day: 'Jum', amount: 90, height: 45 },
  { day: 'Sab', amount: 240, height: 120 },
  { day: 'Min', amount: 190, height: 95 },
];

export default function DriverEarningsScreen() {
  const navigation = useNavigation<any>();

  const renderTransactionItem = ({ item }: { item: any }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIconWrapper}>
        {item.type === 'goride' ? <Car color={furapColors.secondary} size={20} /> :
         item.type === 'gofood' ? <Pizza color={furapColors.secondary} size={20} /> :
         item.isCredit ? <ArrowDownLeft color={furapColors.success} size={20} /> : 
         <ArrowUpRight color={furapColors.primary} size={20} />}
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionTime}>{item.time}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: item.isCredit ? furapColors.success : furapColors.primary }]}>
        {item.isCredit ? '+' : '-'} Rp {item.amount.toLocaleString('id-ID')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={furapColors.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pendapatan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Bisa Ditarik</Text>
          <Text style={styles.balanceAmount}>Rp 1.250.000</Text>
          <TouchableOpacity style={styles.withdrawBtn} activeOpacity={0.8}>
            <Text style={styles.withdrawBtnText}>Tarik ke Rekening</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Hari Ini</Text>
            <Text style={styles.summaryValue}>Rp 245K</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Minggu Ini</Text>
            <Text style={styles.summaryValue}>Rp 1.8M</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Bulan Ini</Text>
            <Text style={styles.summaryValue}>Rp 5.2M</Text>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>7 Hari Terakhir</Text>
          <View style={styles.chartWrapper}>
            {mockChartData.map((data, index) => (
              <View key={index} style={styles.chartCol}>
                <View style={[styles.chartBar, { height: data.height }]} />
                <Text style={styles.chartDay}>{data.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>
          <FlatList
            data={mockTransactions}
            keyExtractor={item => item.id}
            renderItem={renderTransactionItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.listDivider} />}
          />
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
  balanceCard: {
    ...furapGlass.card,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    ...furapTypography.bodyMd,
    color: furapColors.secondary,
  },
  balanceAmount: {
    ...furapTypography.displayMd,
    color: furapColors.primary,
    marginTop: 8,
    marginBottom: 20,
  },
  withdrawBtn: {
    backgroundColor: furapColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  withdrawBtnText: {
    ...furapTypography.labelMd,
    color: '#FFFFFF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    ...furapTypography.bodySm,
    color: furapColors.neutral,
    marginBottom: 4,
  },
  summaryValue: {
    ...furapTypography.labelMd,
    color: furapColors.primary,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 4,
  },
  chartContainer: {
    marginHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    ...furapTypography.headingSm,
    color: furapColors.primary,
    marginBottom: 16,
  },
  chartWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    paddingBottom: 8,
  },
  chartCol: {
    alignItems: 'center',
  },
  chartBar: {
    width: 24,
    backgroundColor: furapColors.primary,
    borderRadius: 6,
    marginBottom: 8,
  },
  chartDay: {
    ...furapTypography.bodySm,
    fontSize: 10,
    color: furapColors.neutral,
  },
  listContainer: {
    marginHorizontal: 20,
    marginTop: 32,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30, 30, 30, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    ...furapTypography.labelSm,
    color: furapColors.primary,
  },
  transactionTime: {
    ...furapTypography.bodySm,
    color: furapColors.neutral,
    marginTop: 4,
  },
  transactionAmount: {
    ...furapTypography.labelSm,
    color: furapColors.primary,
  },
  listDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 60,
  }
});
