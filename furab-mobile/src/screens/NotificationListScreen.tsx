import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  FlatList 
} from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Bell, Tag, Receipt, Info } from 'lucide-react-native';

interface NotificationItem {
  id: string;
  type: 'promo' | 'transaksi' | 'info';
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'promo',
    title: 'Diskon Spesial GoFood 30%!',
    description: 'Nikmati potongan hingga Rp 25.000 untuk restoran terdekat pilihanmu hari ini.',
    time: '5m ago',
    unread: true,
  },
  {
    id: '2',
    type: 'transaksi',
    title: 'Top Up GoPay Berhasil',
    description: 'Selamat! Pengisian saldo GoPay sebesar Rp 100.000 via BCA VA telah berhasil.',
    time: '1h ago',
    unread: true,
  },
  {
    id: '3',
    type: 'info',
    title: 'Keamanan Akun Terjaga',
    description: 'Kamu baru saja menambahkan metode pembayaran baru ke akun Furab-mu.',
    time: '3h ago',
    unread: false,
  },
  {
    id: '4',
    type: 'promo',
    title: 'Gajian Hemat dengan GoRide',
    description: 'Gunakan kode promo GOWESHEMAT untuk diskon 50% perjalanan pertamamu minggu ini.',
    time: '1d ago',
    unread: false,
  },
  {
    id: '5',
    type: 'transaksi',
    title: 'Pembayaran GoFood Martabak San Francisco',
    description: 'Transaksi sebesar Rp 45.000 telah selesai diproses.',
    time: '2d ago',
    unread: false,
  },
  {
    id: '6',
    type: 'info',
    title: 'Pembaruan Fitur Furab Super-App',
    description: 'Kami baru saja merilis pembaruan performa maps dan kestabilan chat driver.',
    time: '3d ago',
    unread: false,
  },
];

type FilterType = 'semua' | 'promo' | 'transaksi' | 'info';

export default function NotificationListScreen() {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState<FilterType>('semua');
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(item => item.id === id ? { ...item, unread: false } : item)
    );
  };

  const filteredNotifications = notifications.filter(item => {
    if (activeFilter === 'semua') return true;
    return item.type === activeFilter;
  });

  const renderNotificationIcon = (type: NotificationItem['type']) => {
    const iconSize = 20;
    switch (type) {
      case 'promo':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255, 149, 0, 0.15)' }]}>
            <Tag color="#FF9500" size={iconSize} />
          </View>
        );
      case 'transaksi':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: 'rgba(52, 199, 89, 0.15)' }]}>
            <Receipt color="#34C759" size={iconSize} />
          </View>
        );
      case 'info':
      default:
        return (
          <View style={[styles.iconWrapper, { backgroundColor: 'rgba(0, 122, 255, 0.15)' }]}>
            <Info color="#007AFF" size={iconSize} />
          </View>
        );
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, item.unread && styles.unreadCard]}
      onPress={() => handleMarkAsRead(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {renderNotificationIcon(item.type)}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, item.unread && styles.unreadTitle]} numberOfLines={1}>
              {item.title}
            </Text>
            {item.unread && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.description} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Decorative Blobs for background depth */}
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
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Horizontal Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {(['semua', 'promo', 'transaksi', 'info'] as FilterType[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab, 
                activeFilter === filter && styles.filterTabActive
              ]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterText, 
                activeFilter === filter && styles.filterTextActive
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Bell color={furapColors.neutral} size={48} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>Tidak ada notifikasi baru</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: furapColors.background,
  },
  backgroundBlob1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#E9E8E7',
    opacity: 0.5,
    top: '10%',
    right: -50,
  },
  backgroundBlob2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#DFE0E0',
    opacity: 0.5,
    bottom: '15%',
    left: -50,
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
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterTabActive: {
    backgroundColor: furapColors.primary,
    borderColor: furapColors.primary,
  },
  filterText: {
    ...furapTypography.bodyMd,
    color: furapColors.secondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: furapColors.onPrimary,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  notificationCard: {
    ...furapGlass.card,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  unreadCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'rgba(26, 26, 26, 0.15)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    ...furapTypography.bodyMd,
    color: furapColors.secondary,
    fontWeight: '500',
    flex: 1,
    paddingRight: 8,
  },
  unreadTitle: {
    color: furapColors.primary,
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  description: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.neutral,
    marginBottom: 6,
  },
  timeText: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    ...furapTypography.bodyMd,
    color: furapColors.neutral,
  },
});
