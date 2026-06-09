import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions, TextInput } from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { 
  Wallet, Car, Pizza, History, LogOut, ChevronRight, Plus, Send, 
  Home, FileText, MessageSquare, User, Settings, Search, Bell, HelpCircle 
} from 'lucide-react-native';
import { useAuthStore } from '../store/authStore';

const { width } = Dimensions.get('window');

type TabType = 'beranda' | 'aktifitas' | 'chat' | 'profile';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<TabType>('beranda');
  const [searchQuery, setSearchQuery] = useState('');

  const contactName = user?.contact ? user.contact.split('@')[0] : 'Alex';
  const displayName = contactName.charAt(0).toUpperCase() + contactName.slice(1);

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'beranda':
        return (
          <View>
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.brandLabel}>Furab App</Text>
                <Text style={styles.greeting}>Good morning, {displayName}</Text>
                <Text style={styles.subtitle}>Where would you like to go today?</Text>
              </View>
              <TouchableOpacity 
                style={styles.notificationButton} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('NotificationList')}
              >
                <Bell color={furapColors.primary} size={20} />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
              <Search color={furapColors.neutral} size={18} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search food, destination..."
                placeholderTextColor={furapColors.neutral}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* GoPay Wallet Card */}
            <View style={styles.walletCard}>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('GoPayDetail')}
              >
                <View style={styles.walletHeader}>
                  <View style={styles.walletIconContainer}>
                    <Wallet color={furapColors.primary} size={20} />
                  </View>
                  <Text style={styles.walletTitle}>GoPay</Text>
                </View>
                <View style={styles.balanceContainer}>
                  <Text style={styles.walletBalance}>Rp {(user?.balance ?? 150000).toLocaleString('id-ID')}</Text>
                </View>
              </TouchableOpacity>
              
              <View style={styles.walletActions}>
                <TouchableOpacity 
                  style={styles.walletBtn} 
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('GoPayTopUp')}
                >
                  <Plus color={furapColors.onPrimary} size={16} style={{ marginRight: 6 }} />
                  <Text style={styles.walletBtnText}>Top Up</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.walletBtnSecondary} 
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('GoPayTransfer')}
                >
                  <Send color={furapColors.primary} size={16} style={{ marginRight: 6 }} />
                  <Text style={styles.walletBtnTextSecondary}>Pay</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Features Row (3 Features: Gojek, GoPay, GoFood) */}
            <Text style={styles.sectionTitle}>Main Services</Text>
            <View style={styles.featuresRow}>
              {/* Gojek (GoRide) */}
              <TouchableOpacity 
                style={styles.featureItem} 
                onPress={() => navigation.navigate('GoRide')}
                activeOpacity={0.8}
              >
                <View style={styles.featureIconContainer}>
                  <Car color={furapColors.primary} size={26} />
                </View>
                <Text style={styles.featureLabel}>Gojek</Text>
              </TouchableOpacity>

              {/* GoPay */}
              <TouchableOpacity 
                style={styles.featureItem} 
                onPress={() => navigation.navigate('GoPayDetail')}
                activeOpacity={0.8}
              >
                <View style={styles.featureIconContainer}>
                  <Wallet color={furapColors.primary} size={26} />
                </View>
                <Text style={styles.featureLabel}>GoPay</Text>
              </TouchableOpacity>

              {/* GoFood */}
              <TouchableOpacity 
                style={styles.featureItem} 
                onPress={() => navigation.navigate('GoFood')}
                activeOpacity={0.8}
              >
                <View style={styles.featureIconContainer}>
                  <Pizza color={furapColors.primary} size={26} />
                </View>
                <Text style={styles.featureLabel}>GoFood</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Activity */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={() => setActiveTab('aktifitas')}>
                <Text style={styles.seeAllText}>History</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityContainer}>
              <TouchableOpacity 
                style={styles.activityItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ActivityDetail', {
                  activity: { name: 'The Gourmet Bistro', priceVal: 425000, time: 'Hari ini, 12:30 PM', type: 'food' }
                })}
              >
                <View style={styles.activityIconWrapper}>
                  <Pizza color={furapColors.secondary} size={18} />
                </View>
                <View style={styles.activityDetail}>
                  <Text style={styles.activityName}>The Gourmet Bistro</Text>
                  <Text style={styles.activityTime}>Ordered • Today, 12:30 PM</Text>
                </View>
                <Text style={styles.activityPrice}>Rp 425.000</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.activityItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ActivityDetail', {
                  activity: { name: 'Work to Home', priceVal: 18000, time: 'Kemarin, 5:45 PM', type: 'ride' }
                })}
              >
                <View style={styles.activityIconWrapper}>
                  <Car color={furapColors.secondary} size={18} />
                </View>
                <View style={styles.activityDetail}>
                  <Text style={styles.activityName}>Work to Home</Text>
                  <Text style={styles.activityTime}>Ride • Yesterday</Text>
                </View>
                <Text style={styles.activityPrice}>Rp 18.000</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'aktifitas':
        return (
          <View>
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.brandLabel}>History</Text>
                <Text style={styles.greeting}>Recent Activity</Text>
                <Text style={styles.subtitle}>Track your latest requests and transactions</Text>
              </View>
            </View>

            <View style={styles.activityContainer}>
              <TouchableOpacity 
                style={styles.activityItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ActivityDetail', {
                  activity: { name: 'The Gourmet Bistro', priceVal: 425000, time: 'Hari ini, 12:30 PM', type: 'food' }
                })}
              >
                <View style={styles.activityIconWrapper}>
                  <Pizza color={furapColors.secondary} size={18} />
                </View>
                <View style={styles.activityDetail}>
                  <Text style={styles.activityName}>The Gourmet Bistro</Text>
                  <Text style={styles.activityTime}>Ordered • Today, 12:30 PM</Text>
                </View>
                <Text style={styles.activityPrice}>Rp 425.000</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.activityItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ActivityDetail', {
                  activity: { name: 'Work to Home', priceVal: 18000, time: 'Kemarin, 5:45 PM', type: 'ride' }
                })}
              >
                <View style={styles.activityIconWrapper}>
                  <Car color={furapColors.secondary} size={18} />
                </View>
                <View style={styles.activityDetail}>
                  <Text style={styles.activityName}>Work to Home</Text>
                  <Text style={styles.activityTime}>Ride • Yesterday, 5:45 PM</Text>
                </View>
                <Text style={styles.activityPrice}>Rp 18.000</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.activityItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ActivityDetail', {
                  activity: { name: 'Organic Market', priceVal: 64000, time: '2 hari lalu, 10:15 AM', type: 'food' }
                })}
              >
                <View style={styles.activityIconWrapper}>
                  <History color={furapColors.secondary} size={18} />
                </View>
                <View style={styles.activityDetail}>
                  <Text style={styles.activityName}>Organic Market</Text>
                  <Text style={styles.activityTime}>Grocery • 2 days ago, 10:15 AM</Text>
                </View>
                <Text style={styles.activityPrice}>Rp 64.000</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.activityItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ActivityDetail', {
                  activity: { name: 'Star Coffee Co.', priceVal: 48000, time: '4 hari lalu', type: 'food' }
                })}
              >
                <View style={styles.activityIconWrapper}>
                  <Pizza color={furapColors.secondary} size={18} />
                </View>
                <View style={styles.activityDetail}>
                  <Text style={styles.activityName}>Star Coffee Co.</Text>
                  <Text style={styles.activityTime}>Ordered • 4 days ago</Text>
                </View>
                <Text style={styles.activityPrice}>Rp 48.000</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'chat':
        return (
          <View>
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.brandLabel}>Messages</Text>
                <Text style={styles.greeting}>Inbox Chat</Text>
                <Text style={styles.subtitle}>Chat with your active drivers and restaurants</Text>
              </View>
            </View>

            {/* Chat List */}
            <View style={styles.activityContainer}>
              <TouchableOpacity 
                style={styles.activityItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ChatRoom', {
                  senderName: 'Budi (Gojek Driver)',
                  vehicle: 'Yamaha NMax [D 1234 ABC]',
                  service: 'GoRide'
                })}
              >
                <View style={styles.activityIconWrapper}>
                  <Car color={furapColors.primary} size={18} />
                </View>
                <View style={styles.activityDetail}>
                  <View style={styles.chatHeaderRow}>
                    <Text style={styles.activityName}>Budi (Gojek Driver)</Text>
                    <Text style={styles.chatTime}>12:35 PM</Text>
                  </View>
                  <Text style={styles.chatMessage} numberOfLines={1}>
                    Saya sudah dekat lokasi ya kak. Mohon ditunggu...
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.activityItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ChatRoom', {
                  senderName: 'Martabak San Francisco',
                  service: 'GoFood',
                  merchantName: 'Martabak San Francisco'
                })}
              >
                <View style={styles.activityIconWrapper}>
                  <Pizza color={furapColors.primary} size={18} />
                </View>
                <View style={styles.activityDetail}>
                  <View style={styles.chatHeaderRow}>
                    <Text style={styles.activityName}>Martabak San Francisco</Text>
                    <Text style={styles.chatTime}>Yesterday</Text>
                  </View>
                  <Text style={styles.chatMessage} numberOfLines={1}>
                    Pesanan Anda sedang disiapkan oleh koki kami.
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.activityItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ChatRoom', {
                  senderName: 'Siti (Gojek Driver)',
                  vehicle: 'Honda Beat [D 5678 EEE]',
                  service: 'GoRide'
                })}
              >
                <View style={styles.activityIconWrapper}>
                  <Car color={furapColors.secondary} size={18} />
                </View>
                <View style={styles.activityDetail}>
                  <View style={styles.chatHeaderRow}>
                    <Text style={styles.activityName}>Siti (Gojek Driver)</Text>
                    <Text style={styles.chatTime}>2 days ago</Text>
                  </View>
                  <Text style={styles.chatMessage} numberOfLines={1}>
                    Terima kasih banyak atas tipnya kak! Semoga sehat selalu.
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'profile':
        return (
          <View>
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.brandLabel}>Account</Text>
                <Text style={styles.greeting}>Profile Setting</Text>
                <Text style={styles.subtitle}>Manage your settings and session details</Text>
              </View>
            </View>

            {/* Profile Detail Card */}
            <View style={styles.profileDetailCard}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{displayName.substring(0, 2).toUpperCase()}</Text>
              </View>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{user?.contact || 'demo@furab.com'}</Text>
            </View>

            {/* Settings Options */}
            <Text style={styles.sectionTitle}>General</Text>
            <View style={styles.settingsGroup}>
              <TouchableOpacity 
                style={styles.settingsItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('AccountSettings')}
              >
                <View style={styles.settingsItemLeft}>
                  <Settings color={furapColors.primary} size={20} style={{ marginRight: 12 }} />
                  <Text style={styles.settingsItemText}>Account Settings</Text>
                </View>
                <ChevronRight color={furapColors.neutral} size={18} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.settingsItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('PaymentMethods')}
              >
                <View style={styles.settingsItemLeft}>
                  <Wallet color={furapColors.primary} size={20} style={{ marginRight: 12 }} />
                  <Text style={styles.settingsItemText}>Payment Methods</Text>
                </View>
                <ChevronRight color={furapColors.neutral} size={18} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.settingsItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('HelpCenter')}
              >
                <View style={styles.settingsItemLeft}>
                  <HelpCircle color={furapColors.primary} size={20} style={{ marginRight: 12 }} />
                  <Text style={styles.settingsItemText}>Help Center</Text>
                </View>
                <ChevronRight color={furapColors.neutral} size={18} />
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              style={styles.logoutBtn} 
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <LogOut color={furapColors.error} size={18} style={{ marginRight: 8 }} />
              <Text style={styles.logoutBtnText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Background Blobs for Glassmorphism depth */}
      <View style={styles.backgroundBlob1} />
      <View style={styles.backgroundBlob2} />
      <View style={styles.backgroundBlob3} />

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>

      {/* Floating Glass Bottom Navigation Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setActiveTab('beranda')}
          activeOpacity={0.7}
        >
          <Home color={activeTab === 'beranda' ? furapColors.primary : furapColors.neutral} size={22} />
          <Text style={[styles.tabLabel, activeTab === 'beranda' && styles.tabLabelActive]}>Beranda</Text>
          {activeTab === 'beranda' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setActiveTab('aktifitas')}
          activeOpacity={0.7}
        >
          <FileText color={activeTab === 'aktifitas' ? furapColors.primary : furapColors.neutral} size={22} />
          <Text style={[styles.tabLabel, activeTab === 'aktifitas' && styles.tabLabelActive]}>Aktifitas</Text>
          {activeTab === 'aktifitas' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setActiveTab('chat')}
          activeOpacity={0.7}
        >
          <MessageSquare color={activeTab === 'chat' ? furapColors.primary : furapColors.neutral} size={22} />
          <Text style={[styles.tabLabel, activeTab === 'chat' && styles.tabLabelActive]}>Chat</Text>
          {activeTab === 'chat' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        >
          <User color={activeTab === 'profile' ? furapColors.primary : furapColors.neutral} size={22} />
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>Profile</Text>
          {activeTab === 'profile' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: furapColors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 110, // Memberikan ruang agar tidak tertutup bottom tab bar
  },
  backgroundBlob1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#E9E8E7',
    opacity: 0.6,
    top: -50,
    right: -80,
  },
  backgroundBlob2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#DFE0E0',
    opacity: 0.5,
    bottom: 100,
    left: -100,
  },
  backgroundBlob3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E3E2E2',
    opacity: 0.4,
    top: '40%',
    right: '5%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  brandLabel: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
    marginBottom: 4,
  },
  greeting: {
    ...furapTypography.headlineMd,
    fontSize: 26,
    color: furapColors.primary,
  },
  subtitle: {
    ...furapTypography.bodyMd,
    color: furapColors.secondary,
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  // Search Bar
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    ...furapGlass.input,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    ...furapTypography.bodyMd,
    color: furapColors.primary,
    height: '100%',
    padding: 0, // hapus default padding untuk android
  },
  walletCard: {
    ...furapGlass.card,
    padding: 20,
    marginBottom: 24,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  walletTitle: {
    ...furapTypography.labelSm,
    color: furapColors.primary,
    fontWeight: '700',
  },
  balanceContainer: {
    marginBottom: 18,
  },
  walletBalance: {
    ...furapTypography.displayLg,
    fontSize: 32,
    color: furapColors.primary,
  },
  walletActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  walletBtn: {
    ...furapGlass.buttonPrimary,
    flexDirection: 'row',
    paddingVertical: 12,
    width: '48%',
  },
  walletBtnText: {
    ...furapTypography.buttonText,
    fontSize: 14,
  },
  walletBtnSecondary: {
    ...furapGlass.buttonSecondary,
    flexDirection: 'row',
    paddingVertical: 12,
    width: '48%',
  },
  walletBtnTextSecondary: {
    ...furapTypography.buttonText,
    color: furapColors.primary,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 8,
  },
  sectionTitle: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
    marginBottom: 12,
  },
  seeAllText: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.primary,
    fontWeight: '600',
  },
  // Features Row
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  featureItem: {
    alignItems: 'center',
    width: (width - 60) / 3,
  },
  featureIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  featureLabel: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
  },
  activityContainer: {
    ...furapGlass.card,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityDetail: {
    flex: 1,
  },
  activityName: {
    ...furapTypography.headlineMd,
    fontSize: 15,
    color: furapColors.primary,
  },
  activityTime: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
    marginTop: 2,
  },
  activityPrice: {
    ...furapTypography.headlineMd,
    fontSize: 15,
    color: furapColors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.05)',
  },
  // Chat Tab Styles
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  chatTime: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
  },
  chatMessage: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.secondary,
    marginTop: 2,
  },
  // Profile Tab Styles
  profileDetailCard: {
    ...furapGlass.card,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: furapColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    ...furapTypography.headlineMd,
    color: '#FFFFFF',
    fontSize: 28,
  },
  profileName: {
    ...furapTypography.headlineMd,
    color: furapColors.primary,
    fontSize: 22,
    marginBottom: 4,
  },
  profileEmail: {
    ...furapTypography.bodyMd,
    color: furapColors.neutral,
  },
  settingsGroup: {
    ...furapGlass.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    ...furapTypography.headlineMd,
    fontSize: 15,
    color: furapColors.primary,
  },
  logoutBtn: {
    ...furapGlass.buttonSecondary,
    borderColor: 'rgba(186, 26, 26, 0.2)',
    backgroundColor: 'rgba(186, 26, 26, 0.05)',
    flexDirection: 'row',
    paddingVertical: 14,
    marginBottom: 20,
  },
  logoutBtnText: {
    ...furapTypography.buttonText,
    color: furapColors.error,
    fontSize: 15,
  },
  // Floating Tab Bar Styles
  bottomTabBar: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 25,
    elevation: 1,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 5,
    height: '100%',
    position: 'relative',
    paddingTop: 4,
  },
  tabLabel: {
    ...furapTypography.labelSm,
    fontSize: 10,
    textTransform: 'none',
    letterSpacing: 0,
    marginTop: 4,
  },
  tabLabelActive: {
    color: furapColors.primary,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: furapColors.primary,
  }
});
