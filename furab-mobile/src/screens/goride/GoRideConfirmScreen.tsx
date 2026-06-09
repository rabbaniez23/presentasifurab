import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  Alert 
} from 'react-native';
import { ChevronLeft, ArrowRight, Wallet, CreditCard, DollarSign, Calendar, Info, Car } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

type PackageType = 'hemat' | 'biasa' | 'comfort' | 'instan';
type PaymentType = 'gopay' | 'transfer' | 'cash';

export default function GoRideConfirmScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user = useAuthStore((state) => state.user);
  const { pickup, destination } = route.params || { pickup: 'Kampus Utama UPI', destination: '' };

  const currentBalance = user?.balance ?? 150000;
  
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('biasa');
  const [selectedPayment, setSelectedPayment] = useState<PaymentType>('gopay');
  const [scheduleRide, setScheduleRide] = useState(false);

  const packages = {
    hemat: { title: 'GoRide Hemat', price: 12000, desc: 'Ekonomis untuk rute pendek' },
    biasa: { title: 'GoRide', price: 16000, desc: 'Perjalanan standar harian' },
    comfort: { title: 'GoRide Comfort', price: 22000, desc: 'Motor besar & nyaman' },
    instan: { title: 'GoRide Instan', price: 28000, desc: 'Langsung jalan tanpa antre' }
  };

  const currentPrice = packages[selectedPackage].price;

  const handleOrder = () => {
    if (selectedPayment === 'gopay' && currentBalance < currentPrice) {
      Alert.alert('Saldo Kurang', 'Saldo GoPay tidak mencukupi untuk melakukan pemesanan ini.', [
        { text: 'Pilih Pembayaran Lain', onPress: () => setSelectedPayment('cash') },
        { text: 'Top Up', onPress: () => {} }
      ]);
      return;
    }
    navigation.navigate('GoRideSearching', {
      pickup,
      destination,
      selectedPackage,
      selectedPayment
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Konfirmasi Perjalanan</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Top Route Banner */}
      <View style={styles.routeBanner}>
        <View style={styles.routeBulletGroup}>
          <View style={[styles.bulletPoint, { backgroundColor: '#10B981' }]} />
          <View style={styles.bulletLine} />
          <View style={[styles.bulletPoint, { backgroundColor: '#EF4444' }]} />
        </View>
        <View style={styles.routeTextGroup}>
          <Text style={styles.routeLabel} numberOfLines={1}>Dari: {pickup}</Text>
          <Text style={styles.routeLabel} numberOfLines={1}>Ke: {destination}</Text>
        </View>
      </View>

      <ScrollView style={styles.confirmScroll} contentContainerStyle={{ paddingBottom: 200 }}>
        {/* Package Selection */}
        <Text style={styles.sectionTitle}>Pilih Tipe Perjalanan</Text>
        {Object.entries(packages).map(([key, pkg]) => {
          const isActive = selectedPackage === key;
          return (
            <TouchableOpacity 
              key={key} 
              style={[styles.packageCard, isActive && styles.packageCardActive]}
              onPress={() => setSelectedPackage(key as PackageType)}
            >
              <View style={styles.packageIconBg}>
                <Car color={isActive ? furapColors.onPrimary : furapColors.primary} size={22} />
              </View>
              <View style={styles.packageInfo}>
                <Text style={[styles.packageTitle, isActive && styles.packageTextActive]}>{pkg.title}</Text>
                <Text style={[styles.packageDesc, isActive && styles.packageTextSecondaryActive]}>{pkg.desc}</Text>
              </View>
              <Text style={[styles.packagePrice, isActive && styles.packageTextActive]}>
                Rp {pkg.price.toLocaleString('id-ID')}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Info color={furapColors.neutral} size={14} style={{ marginRight: 6 }} />
          <Text style={styles.disclaimerText}>Tarif ini belum termasuk ongkos tol & parkir.</Text>
        </View>

        {/* Payment Options */}
        <Text style={styles.sectionTitle}>Opsi Pembayaran</Text>
        <View style={styles.paymentGroup}>
          <TouchableOpacity 
            style={[styles.paymentBtn, selectedPayment === 'gopay' && styles.paymentBtnActive]}
            onPress={() => setSelectedPayment('gopay')}
          >
            <Wallet color={selectedPayment === 'gopay' ? furapColors.onPrimary : furapColors.primary} size={18} style={{ marginRight: 6 }} />
            <Text style={[styles.paymentBtnText, selectedPayment === 'gopay' && styles.paymentBtnTextActive]}>
              GoPay (Rp {currentBalance.toLocaleString('id-ID')})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentBtn, selectedPayment === 'transfer' && styles.paymentBtnActive]}
            onPress={() => setSelectedPayment('transfer')}
          >
            <CreditCard color={selectedPayment === 'transfer' ? furapColors.onPrimary : furapColors.primary} size={18} style={{ marginRight: 6 }} />
            <Text style={[styles.paymentBtnText, selectedPayment === 'transfer' && styles.paymentBtnTextActive]}>
              Transfer Rekening
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentBtn, selectedPayment === 'cash' && styles.paymentBtnActive]}
            onPress={() => setSelectedPayment('cash')}
          >
            <DollarSign color={selectedPayment === 'cash' ? furapColors.onPrimary : furapColors.primary} size={18} style={{ marginRight: 6 }} />
            <Text style={[styles.paymentBtnText, selectedPayment === 'cash' && styles.paymentBtnTextActive]}>
              Tunai (Cash)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Bottom Order Panel */}
      <View style={styles.bottomOrderPanel}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Estimasi Tarif</Text>
          <Text style={styles.priceValue}>Rp {currentPrice.toLocaleString('id-ID')}</Text>
        </View>
        
        <View style={styles.orderActionsRow}>
          {/* Scheduling Icon */}
          <TouchableOpacity 
            style={[styles.scheduleBtn, scheduleRide && styles.scheduleBtnActive]}
            onPress={() => {
              setScheduleRide(!scheduleRide);
              Alert.alert('Penjadwalan', scheduleRide ? 'Pemesanan otomatis dibatalkan' : 'Pemesanan otomatis dijadwalkan saat pengemudi tersedia.');
            }}
          >
            <Calendar color={scheduleRide ? furapColors.onPrimary : furapColors.primary} size={20} />
          </TouchableOpacity>

          {/* Order Submit Button */}
          <TouchableOpacity 
            style={styles.submitOrderBtn}
            onPress={handleOrder}
          >
            <Text style={styles.submitOrderText}>Pesan Sekarang</Text>
            <ArrowRight color={furapColors.onPrimary} size={18} />
          </TouchableOpacity>
        </View>
      </View>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...furapTypography.headlineMd,
    fontSize: 18,
    color: furapColors.primary,
  },
  routeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.04)',
    borderColor: 'rgba(26, 26, 26, 0.08)',
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 12,
    marginBottom: 16,
  },
  routeBulletGroup: {
    alignItems: 'center',
    marginRight: 12,
    width: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bulletLine: {
    width: 1.5,
    height: 16,
    backgroundColor: 'rgba(26, 26, 26, 0.2)',
    marginVertical: 2,
  },
  routeTextGroup: {
    flex: 1,
  },
  routeLabel: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.secondary,
    marginVertical: 1,
  },
  confirmScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
    marginBottom: 12,
    marginTop: 8,
  },
  packageCard: {
    ...furapGlass.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  packageCardActive: {
    backgroundColor: furapColors.primary,
    borderColor: furapColors.primary,
  },
  packageIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(26, 26, 26, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  packageInfo: {
    flex: 1,
  },
  packageTitle: {
    ...furapTypography.headlineMd,
    fontSize: 15,
    color: furapColors.primary,
  },
  packageDesc: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
    marginTop: 2,
  },
  packagePrice: {
    ...furapTypography.headlineMd,
    fontSize: 15,
    color: furapColors.primary,
  },
  packageTextActive: {
    color: '#FFFFFF',
  },
  packageTextSecondaryActive: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  disclaimerText: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
  },
  paymentGroup: {
    marginBottom: 24,
  },
  paymentBtn: {
    ...furapGlass.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  paymentBtnActive: {
    backgroundColor: furapColors.primary,
    borderColor: furapColors.primary,
  },
  paymentBtnText: {
    ...furapTypography.headlineMd,
    fontSize: 13,
    color: furapColors.primary,
  },
  paymentBtnTextActive: {
    color: '#FFFFFF',
  },
  bottomOrderPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopColor: 'rgba(26, 26, 26, 0.08)',
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  priceLabel: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.neutral,
  },
  priceValue: {
    ...furapTypography.displayLg,
    fontSize: 22,
    color: furapColors.primary,
  },
  orderActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderColor: 'rgba(26, 26, 26, 0.15)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  scheduleBtnActive: {
    backgroundColor: furapColors.primary,
    borderColor: furapColors.primary,
  },
  submitOrderBtn: {
    ...furapGlass.buttonPrimary,
    flex: 1,
    height: 50,
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitOrderText: {
    ...furapTypography.buttonText,
    fontSize: 16,
    marginRight: 8,
  },
});
