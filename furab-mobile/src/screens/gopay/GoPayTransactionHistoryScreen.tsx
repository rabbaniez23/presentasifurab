import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SectionList, 
  ScrollView,
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { ChevronLeft, ArrowDownLeft, ArrowUpRight, ArrowDown, ArrowUp, Calendar } from 'lucide-react-native';

interface Transaction {
  id: string;
  title: string;
  time: string;
  amount: number;
  type: 'in' | 'out';
  daysAgo: number; // For filtering: 0 = Today, 1 = Yesterday, etc.
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Top Up Gopay Mandiri', time: '09:15 AM', amount: 100000, type: 'in', daysAgo: 0 },
  { id: '2', title: 'Gourmet Bistro GoFood', time: '12:30 PM', amount: 125000, type: 'out', daysAgo: 0 },
  { id: '3', title: 'Kopi Kenangan Ciwalk', time: '02:45 PM', amount: 28000, type: 'out', daysAgo: 0 },
  
  { id: '4', title: 'Ciwalk GoRide', time: '08:30 AM', amount: 18000, type: 'out', daysAgo: 1 },
  { id: '5', title: 'Martabak San Francisco GoFood', time: '07:15 PM', amount: 75000, type: 'out', daysAgo: 1 },
  { id: '6', title: 'Transfer dari Budi', time: '11:00 AM', amount: 50000, type: 'in', daysAgo: 1 },
  
  { id: '7', title: 'Indomaret Cashback Promo', time: '04:20 PM', amount: 15000, type: 'in', daysAgo: 3 },
  { id: '8', title: 'GoCar Bandara Soetta', time: '05:00 AM', amount: 185000, type: 'out', daysAgo: 4 },
  
  { id: '9', title: 'Refund Tokopedia Belanja', time: '03:00 PM', amount: 320000, type: 'in', daysAgo: 5 },
  { id: '10', title: 'PLN Token Listrik', time: '10:00 AM', amount: 100000, type: 'out', daysAgo: 6 },
  
  { id: '11', title: 'Tagihan GoPayLater', time: '09:00 AM', amount: 250000, type: 'out', daysAgo: 8 },
  { id: '12', title: 'Transfer ke Siti', time: '11:30 AM', amount: 45000, type: 'out', daysAgo: 10 },
  
  { id: '13', title: 'Top Up BCA Virtual Account', time: '01:15 PM', amount: 200000, type: 'in', daysAgo: 12 },
  { id: '14', title: 'Spotify Premium Bulanan', time: '08:00 AM', amount: 54900, type: 'out', daysAgo: 20 },
  { id: '15', title: 'Steam Wallet Purchase', time: '10:30 PM', amount: 120000, type: 'out', daysAgo: 25 },
];

export default function GoPayTransactionHistoryScreen() {
  const navigation = useNavigation<any>();

  // State filters
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days'>('30days');
  const [typeFilter, setTypeFilter] = useState<'all' | 'in' | 'out'>('all');

  // Calculate stats based on current time window (independent of type filter to show summary card correctly)
  const stats = useMemo(() => {
    const limit = timeFilter === 'today' ? 0 : timeFilter === '7days' ? 7 : 30;
    let totalIn = 0;
    let totalOut = 0;

    MOCK_TRANSACTIONS.forEach(tx => {
      if (tx.daysAgo <= limit) {
        if (tx.type === 'in') {
          totalIn += tx.amount;
        } else {
          totalOut += tx.amount;
        }
      }
    });

    return { totalIn, totalOut };
  }, [timeFilter]);

  // Filtered and Grouped Transactions
  const sections = useMemo(() => {
    const timeLimit = timeFilter === 'today' ? 0 : timeFilter === '7days' ? 7 : 30;

    // Filter items
    const filtered = MOCK_TRANSACTIONS.filter(tx => {
      const matchTime = tx.daysAgo <= timeLimit;
      const matchType = typeFilter === 'all' ? true : tx.type === typeFilter;
      return matchTime && matchType;
    });

    // Group items by date
    const groups: { [key: string]: Transaction[] } = {};
    filtered.forEach(tx => {
      let dateHeader = '';
      if (tx.daysAgo === 0) {
        dateHeader = 'Hari Ini';
      } else if (tx.daysAgo === 1) {
        dateHeader = 'Kemarin';
      } else {
        dateHeader = `${tx.daysAgo} Hari Lalu`;
      }

      if (!groups[dateHeader]) {
        groups[dateHeader] = [];
      }
      groups[dateHeader].push(tx);
    });

    // Convert to SectionList format
    return Object.keys(groups).map(header => ({
      title: header,
      data: groups[header]
    }));
  }, [timeFilter, typeFilter]);

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
        <Text style={styles.headerTitle}>Riwayat Transaksi</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Summary Card */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryPeriod}>
            Ikhtisar Keuangan ({timeFilter === 'today' ? 'Hari Ini' : timeFilter === '7days' ? '7 Hari Terakhir' : '30 Hari Terakhir'})
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <View style={styles.statHeader}>
                <ArrowDown color="#2E7D32" size={14} style={{ marginRight: 4 }} />
                <Text style={styles.statLabel}>Total Masuk</Text>
              </View>
              <Text style={styles.incomeAmount}>Rp {stats.totalIn.toLocaleString('id-ID')}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <View style={styles.statHeader}>
                <ArrowUp color="#C62828" size={14} style={{ marginRight: 4 }} />
                <Text style={styles.statLabel}>Total Keluar</Text>
              </View>
              <Text style={styles.expenseAmount}>Rp {stats.totalOut.toLocaleString('id-ID')}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Time Window Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterChip, timeFilter === 'today' && styles.filterChipActive]}
            onPress={() => setTimeFilter('today')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, timeFilter === 'today' && styles.filterTextActive]}>Hari Ini</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, timeFilter === '7days' && styles.filterChipActive]}
            onPress={() => setTimeFilter('7days')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, timeFilter === '7days' && styles.filterTextActive]}>7 Hari</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, timeFilter === '30days' && styles.filterChipActive]}
            onPress={() => setTimeFilter('30days')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, timeFilter === '30days' && styles.filterTextActive]}>30 Hari</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Transaction Type Filters */}
      <View style={styles.typeFilterContainer}>
        <TouchableOpacity 
          style={[styles.typeChip, typeFilter === 'all' && styles.typeChipActive]}
          onPress={() => setTypeFilter('all')}
          activeOpacity={0.8}
        >
          <Text style={[styles.typeText, typeFilter === 'all' && styles.typeTextActive]}>Semua</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.typeChip, typeFilter === 'in' && styles.typeChipActive]}
          onPress={() => setTypeFilter('in')}
          activeOpacity={0.8}
        >
          <Text style={[styles.typeText, typeFilter === 'in' && styles.typeTextActive]}>Uang Masuk</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.typeChip, typeFilter === 'out' && styles.typeChipActive]}
          onPress={() => setTypeFilter('out')}
          activeOpacity={0.8}
        >
          <Text style={[styles.typeText, typeFilter === 'out' && styles.typeTextActive]}>Uang Keluar</Text>
        </TouchableOpacity>
      </View>

      {/* Sections List */}
      <SectionList 
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeaderContainer}>
            <Calendar size={12} color={furapColors.neutral} style={{ marginRight: 6 }} />
            <Text style={styles.sectionHeaderTitle}>{title}</Text>
          </View>
        )}
        renderItem={({ item, index, section }) => {
          const isIn = item.type === 'in';
          return (
            <View style={styles.itemWrapper}>
              <View style={styles.txRow}>
                <View style={[styles.txIconWrapper, { backgroundColor: isIn ? 'rgba(52, 199, 89, 0.08)' : 'rgba(26, 26, 26, 0.04)' }]}>
                  {isIn ? (
                    <ArrowDownLeft color="#34C759" size={18} />
                  ) : (
                    <ArrowUpRight color={furapColors.primary} size={18} />
                  )}
                </View>
                <View style={styles.txDetails}>
                  <Text style={styles.txTitle}>{item.title}</Text>
                  <Text style={styles.txTime}>{item.time}</Text>
                </View>
                <Text style={[styles.txAmount, { color: isIn ? '#34C759' : furapColors.primary }]}>
                  {isIn ? '+' : '-'} Rp {item.amount.toLocaleString('id-ID')}
                </Text>
              </View>
              {index < section.data.length - 1 && <View style={styles.divider} />}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada transaksi pada periode ini.</Text>
          </View>
        }
      />
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
    top: '8%',
    right: -80,
  },
  backgroundBlob2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#E1E2E2',
    opacity: 0.4,
    bottom: '12%',
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
  summaryContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  summaryCard: {
    ...furapGlass.card,
    backgroundColor: 'rgba(26, 26, 26, 0.03)',
    borderColor: 'rgba(26, 26, 26, 0.05)',
    padding: 16,
  },
  summaryPeriod: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    fontWeight: 'bold',
    color: furapColors.secondary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCol: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    ...furapTypography.bodyMd,
    fontSize: 10,
    color: furapColors.neutral,
  },
  incomeAmount: {
    ...furapTypography.headlineMd,
    fontSize: 15,
    color: '#34C759',
    fontWeight: 'bold',
  },
  expenseAmount: {
    ...furapTypography.headlineMd,
    fontSize: 15,
    color: furapColors.primary,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(26, 26, 26, 0.08)',
    marginHorizontal: 16,
  },
  filterContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  filterScroll: {
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.08)',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: furapColors.primary,
    borderColor: furapColors.primary,
  },
  filterText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.secondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  typeFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  typeChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  typeChipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(26, 26, 26, 0.06)',
    elevation: 1,
  },
  typeText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
  },
  typeTextActive: {
    color: furapColors.primary,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionHeaderTitle: {
    ...furapTypography.labelSm,
    fontSize: 11,
    color: furapColors.neutral,
    fontWeight: 'bold',
  },
  itemWrapper: {
    ...furapGlass.card,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  txIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    ...furapTypography.headlineMd,
    fontSize: 13,
    color: furapColors.primary,
  },
  txTime: {
    ...furapTypography.bodyMd,
    fontSize: 10,
    color: furapColors.neutral,
    marginTop: 2,
  },
  txAmount: {
    ...furapTypography.headlineMd,
    fontSize: 13,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.03)',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    ...furapTypography.bodyMd,
    color: furapColors.neutral,
    fontSize: 13,
  },
});
