import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions, Platform } from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { Power, MapPin, TrendingUp, Star, Wallet, Activity, Home, User } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import MockGoogleMap from '../../components/MockGoogleMap';

const { width } = Dimensions.get('window');

type DriverTab = 'home' | 'earnings' | 'profile';

export default function DriverHomeScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const vehicle = useAuthStore((state) => state.vehicle);
  
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<DriverTab>('home');

  const displayName = user?.name || user?.contact?.split('@')[0] || 'Driver';

  // Simulasi terima order jika online
  useEffect(() => {
    let orderTimer: NodeJS.Timeout;
    if (isOnline) {
      orderTimer = setTimeout(() => {
        Alert.alert(
          'Pesanan Masuk! 🛵',
          'Ada pesanan GoRide baru di dekat Anda.',
          [
            { text: 'Abaikan', style: 'cancel' },
            { 
              text: 'Lihat Detail', 
              onPress: () => {
                navigation.navigate('DriverOrderRequest', {
                  orderId: 'ORD-' + Math.floor(Math.random() * 10000),
                  pickupAddress: 'Jl. Sudirman No. 1',
                  destinationAddress: 'Grand Indonesia Mall',
                  distance: '2.5 km',
                  estimatedTime: '10 min',
                  price: 18000,
                  serviceType: 'goride',
                  customerName: 'Budi Santoso'
                });
              } 
            }
          ]
        );
      }, 10000); // Simulasi 10 detik setelah online
    }

    return () => clearTimeout(orderTimer);
  }, [isOnline, navigation]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <View style={{ flex: 1 }}>
            {/* Header / Toggle Online */}
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.greeting}>Halo, {displayName}</Text>
                <Text style={styles.vehicleInfo}>
                  {vehicle?.type === 'car' ? 'Mobil' : 'Motor'} • {vehicle?.plate || 'B 1234 ABC'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.onlineToggle, isOnline ? styles.onlineToggleActive : styles.onlineToggleInactive]}
                onPress={() => setIsOnline(!isOnline)}
                activeOpacity={0.8}
              >
                <Power color={furapColors.onPrimary} size={20} style={{ marginRight: 8 }} />
                <Text style={styles.onlineToggleText}>{isOnline ? 'Online' : 'Offline'}</Text>
              </TouchableOpacity>
            </View>

            {/* Map Area */}
            <View style={styles.mapContainer}>
              <MockGoogleMap />
              <View style={styles.statusBadge}>
                <View style={[styles.statusIndicator, { backgroundColor: isOnline ? furapColors.success : furapColors.neutral }]} />
                <Text style={styles.statusText}>{isOnline ? 'Mencari order...' : 'Anda sedang offline'}</Text>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Activity color={furapColors.primary} size={24} style={styles.statIcon} />
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Trips</Text>
              </View>
              <View style={styles.statCard}>
                <TrendingUp color={furapColors.primary} size={24} style={styles.statIcon} />
                <Text style={styles.statValue}>Rp 245K</Text>
                <Text style={styles.statLabel}>Hari Ini</Text>
              </View>
              <View style={styles.statCard}>
                <Star color={furapColors.warning} size={24} style={styles.statIcon} />
                <Text style={styles.statValue}>4.9</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>

            {/* Wallet Card */}
            <View style={styles.walletCard}>
              <View style={styles.walletHeader}>
                <View style={styles.walletIconContainer}>
                  <Wallet color={furapColors.primary} size={24} />
                </View>
                <View>
                  <Text style={styles.walletTitle}>Saldo Pendapatan</Text>
                  <Text style={styles.walletBalance}>Rp 1.250.000</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.withdrawBtn} activeOpacity={0.8} onPress={() => navigation.navigate('DriverEarnings')}>
                <Text style={styles.withdrawBtnText}>Tarik Saldo</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      
      case 'earnings':
        // Placeholder, the actual logic should be handled by navigating to the screen if it's a full stack, 
        // but for tab simulation, we just show empty or redirect.
        // It's better to just navigate to full screens for Earnings and Profile to match the user app structure
        // or implement them as views here. Let's redirect for simplicity or implement views.
        return null; 
      
      case 'profile':
        return null;

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      {/* Bottom Tab Bar Simulation */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Home color={activeTab === 'home' ? furapColors.primary : furapColors.neutral} size={24} />
          <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('DriverEarnings')}>
          <Wallet color={furapColors.neutral} size={24} />
          <Text style={styles.tabText}>Earnings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('DriverProfile')}>
          <User color={furapColors.neutral} size={24} />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: furapColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // For bottom tab
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...furapGlass.card,
  },
  greeting: {
    ...furapTypography.headingLg,
    color: furapColors.primary,
  },
  vehicleInfo: {
    ...furapTypography.bodySm,
    color: furapColors.secondary,
    marginTop: 4,
  },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  onlineToggleActive: {
    backgroundColor: furapColors.success,
  },
  onlineToggleInactive: {
    backgroundColor: furapColors.neutral,
  },
  onlineToggleText: {
    ...furapTypography.labelMd,
    color: furapColors.onPrimary,
  },
  mapContainer: {
    margin: 20,
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    ...furapTypography.labelSm,
    color: furapColors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    ...furapGlass.card,
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    ...furapTypography.headingMd,
    color: furapColors.primary,
  },
  statLabel: {
    ...furapTypography.bodySm,
    color: furapColors.secondary,
    marginTop: 4,
  },
  walletCard: {
    ...furapGlass.card,
    marginHorizontal: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(30, 30, 30, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  walletTitle: {
    ...furapTypography.bodySm,
    color: furapColors.secondary,
  },
  walletBalance: {
    ...furapTypography.headingLg,
    color: furapColors.primary,
    marginTop: 4,
  },
  withdrawBtn: {
    backgroundColor: furapColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  withdrawBtnText: {
    ...furapTypography.labelSm,
    color: furapColors.onPrimary,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    ...furapTypography.labelSm,
    fontSize: 10,
    color: furapColors.neutral,
    marginTop: 4,
  },
  tabTextActive: {
    color: furapColors.primary,
  }
});
