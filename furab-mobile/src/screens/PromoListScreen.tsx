import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  TextInput, 
  FlatList,
  Alert 
} from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Gift, Copy, Check, Tag } from 'lucide-react-native';

interface VoucherItem {
  id: string;
  code: string;
  title: string;
  discount: string;
  minOrder: string;
  expiry: string;
}

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  accentColor: string;
}

const MOCK_BANNERS: BannerItem[] = [
  {
    id: '1',
    title: 'Diskon Akhir Pekan',
    subtitle: 'Potongan hingga 50% untuk semua order GoRide',
    badge: 'GORIDE50',
    color: '#FF416C',
    accentColor: '#FF4B2B',
  },
  {
    id: '2',
    title: 'Pesta Kuliner GoFood',
    subtitle: 'Gratis ongkir + Cashback koin GoPay s.d Rp30rb',
    badge: 'FOODPESTA',
    color: '#8A2387',
    accentColor: '#E94057',
  },
  {
    id: '3',
    title: 'Top Up Hoki GoPay',
    subtitle: 'Dapatkan extra saldo Rp10rb dengan VA transfer',
    badge: 'GOPAYHOKI',
    color: '#11998e',
    accentColor: '#38ef7d',
  },
];

const MOCK_VOUCHERS: VoucherItem[] = [
  {
    id: '1',
    code: 'FURABBARU',
    title: 'Voucher Pengguna Baru',
    discount: 'Rp 20.000 OFF',
    minOrder: 'Min. Order Rp 40.000',
    expiry: 'Berlaku s.d 30 Jun 2026',
  },
  {
    id: '2',
    code: 'GOFOOD30',
    title: 'Diskon GoFood Kilat',
    discount: '30% OFF',
    minOrder: 'Min. Order Rp 50.000',
    expiry: 'Berlaku s.d 15 Jun 2026',
  },
  {
    id: '3',
    code: 'GORIDEMURAH',
    title: 'Perjalanan Hemat GoRide',
    discount: 'Rp 5.000 OFF',
    minOrder: 'Min. Order Rp 10.000',
    expiry: 'Berlaku s.d 25 Jun 2026',
  },
  {
    id: '4',
    code: 'COBAINMERCHANT',
    title: 'Cashback Merchant Pilihan',
    discount: '15% Cashback',
    minOrder: 'Min. Order Rp 30.000',
    expiry: 'Berlaku s.d 12 Jun 2026',
  },
];

export default function PromoListScreen() {
  const navigation = useNavigation<any>();
  const [promoInput, setPromoInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      Alert.alert('Error', 'Silakan masukkan kode promo terlebih dahulu.');
      return;
    }
    Alert.alert('Promo Diterapkan', `Kode promo "${promoInput.toUpperCase()}" berhasil dipasang!`);
    setPromoInput('');
  };

  const handleCopyCode = (id: string, code: string) => {
    // Simulate copy to clipboard
    setCopiedId(id);
    Alert.alert('Disalin', `Kode promo "${code}" berhasil disalin.`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const renderBanner = ({ item }: { item: BannerItem }) => (
    <View style={[styles.bannerCard, { backgroundColor: item.color }]}>
      <View style={[styles.bannerOverlay, { backgroundColor: item.accentColor }]} />
      <View style={styles.bannerInfo}>
        <View style={styles.bannerBadgeContainer}>
          <Text style={styles.bannerBadgeText}>{item.badge}</Text>
        </View>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  const renderVoucher = ({ item }: { item: VoucherItem }) => (
    <View style={styles.voucherCard}>
      <View style={styles.voucherLeft}>
        <View style={styles.voucherIconContainer}>
          <Tag color={furapColors.primary} size={22} />
        </View>
        <View style={styles.voucherDetails}>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
          <Text style={styles.voucherTitle}>{item.title}</Text>
          <Text style={styles.voucherSub}>{item.minOrder}</Text>
          <Text style={styles.voucherExpiry}>{item.expiry}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.copyButton, copiedId === item.id && styles.copiedButton]}
        onPress={() => handleCopyCode(item.id, item.code)}
        activeOpacity={0.7}
      >
        {copiedId === item.id ? (
          <Check color="#FFFFFF" size={16} />
        ) : (
          <Copy color={furapColors.primary} size={16} />
        )}
        <Text style={[styles.copyButtonText, copiedId === item.id && styles.copiedButtonText]}>
          {copiedId === item.id ? 'Disalin' : 'Salin'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background blobs */}
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
        <Text style={styles.headerTitle}>Promo & Voucher</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Input Manual Section */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Punya Kode Promo?</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Masukkan kode promo (misal: COBAIN)"
              placeholderTextColor={furapColors.neutral}
              value={promoInput}
              onChangeText={setPromoInput}
              autoCapitalize="characters"
            />
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApplyPromo}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Gunakan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Promo Banners Section */}
        <View style={styles.bannersSection}>
          <Text style={styles.sectionTitle}>Promo Spesial Minggu Ini</Text>
          <FlatList
            horizontal
            data={MOCK_BANNERS}
            keyExtractor={(item) => item.id}
            renderItem={renderBanner}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bannersList}
            snapToInterval={280}
            decelerationRate="fast"
          />
        </View>

        {/* Vouchers Available Section */}
        <View style={styles.vouchersSection}>
          <Text style={styles.sectionTitle}>Voucher Untukmu</Text>
          <FlatList
            data={MOCK_VOUCHERS}
            keyExtractor={(item) => item.id}
            renderItem={renderVoucher}
            scrollEnabled={false} // integrated into outer ScrollView
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
  backgroundBlob1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#E9E8E7',
    opacity: 0.55,
    top: '5%',
    right: -70,
  },
  backgroundBlob2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#DFE0E0',
    opacity: 0.5,
    bottom: '10%',
    left: -70,
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
    paddingBottom: 40,
  },
  inputSection: {
    padding: 20,
  },
  sectionTitle: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    ...furapGlass.input,
    flex: 1,
    height: 48,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  applyButton: {
    height: 48,
    backgroundColor: furapColors.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    ...furapTypography.buttonText,
    fontSize: 14,
  },
  bannersSection: {
    marginBottom: 20,
  },
  bannersList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  bannerCard: {
    width: 270,
    height: 140,
    borderRadius: 16,
    marginRight: 14,
    padding: 18,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '60%',
    height: '100%',
    borderBottomLeftRadius: 100,
    opacity: 0.25,
  },
  bannerInfo: {
    zIndex: 1,
  },
  bannerBadgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  bannerBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
  },
  vouchersSection: {
    paddingHorizontal: 20,
  },
  voucherCard: {
    ...furapGlass.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  voucherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  voucherIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  voucherDetails: {
    flex: 1,
    paddingRight: 10,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(26, 26, 26, 0.08)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  discountText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: furapColors.primary,
  },
  voucherTitle: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
    fontSize: 14,
    marginBottom: 2,
  },
  voucherSub: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.secondary,
    marginBottom: 2,
  },
  voucherExpiry: {
    ...furapTypography.bodyMd,
    fontSize: 10,
    color: furapColors.neutral,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.15)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  copiedButton: {
    backgroundColor: furapColors.primary,
    borderColor: furapColors.primary,
  },
  copyButtonText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  copiedButtonText: {
    color: '#FFFFFF',
  },
});
