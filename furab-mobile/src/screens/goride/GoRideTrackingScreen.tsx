import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  Alert 
} from 'react-native';
import { ChevronLeft, MapPin, Car, Shield, Star, User, CheckCircle2, MessageSquare } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

import MockGoogleMap from '../../components/MockGoogleMap';

type DriverState = 'coming' | 'arrived' | 'trip' | 'completed';
type PackageType = 'hemat' | 'biasa' | 'comfort' | 'instan';

export default function GoRideTrackingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { pickup, destination, selectedPackage, selectedPayment } = route.params || {
    pickup: '',
    destination: '',
    selectedPackage: 'biasa',
    selectedPayment: 'gopay'
  };

  const currentBalance = user?.balance ?? 150000;

  const packages = {
    hemat: { title: 'GoRide Hemat', price: 12000 },
    biasa: { title: 'GoRide', price: 16000 },
    comfort: { title: 'GoRide Comfort', price: 22000 },
    instan: { title: 'GoRide Instan', price: 28000 }
  };

  const currentPrice = packages[selectedPackage as PackageType]?.price ?? 16000;

  const [driverState, setDriverState] = useState<DriverState>('coming');
  const [driverProgress, setDriverProgress] = useState(0);
  const [driverName] = useState('Budi Setiawan');
  const [driverPlate] = useState('D 4321 FUR');
  const [driverRating] = useState('4.9');

  useEffect(() => {
    const interval = setInterval(() => {
      setDriverProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (driverState === 'coming') {
            setDriverState('arrived');
            setTimeout(() => {
              setDriverState('trip');
              setDriverProgress(0);
            }, 2500);
          } else if (driverState === 'trip') {
            setDriverState('completed');
            // Deduct user balance on completion
            if (selectedPayment === 'gopay') {
              const newBalance = Math.max(0, currentBalance - currentPrice);
              setUser({ ...user, balance: newBalance });
            }
          }
          return 100;
        }
        return prev + 10;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [driverState]);

  const handleCancel = () => {
    Alert.alert('Batal Perjalanan', 'Apakah Anda yakin ingin membatalkan pesanan ini?', [
      { text: 'Tidak' },
      { text: 'Ya, Batal', onPress: () => navigation.navigate('Home') }
    ]);
  };

  if (driverState === 'completed') {
    return (
      <View style={styles.doneContainer}>
        <View style={styles.glassCardDone}>
          <View style={styles.successIconWrapper}>
            <CheckCircle2 color="#10B981" size={54} />
          </View>
          
          <Text style={styles.doneHeading}>Perjalanan Selesai!</Text>
          <Text style={styles.doneSubheading}>Terima kasih telah bepergian bersama GoRide.</Text>

          <View style={styles.receiptContainer}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Layanan</Text>
              <Text style={styles.receiptVal}>
                {packages[selectedPackage as PackageType]?.title || 'GoRide'}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Metode Pembayaran</Text>
              <Text style={styles.receiptVal}>
                {selectedPayment === 'gopay' && 'GoPay'}
                {selectedPayment === 'transfer' && 'Transfer Rekening'}
                {selectedPayment === 'cash' && 'Tunai'}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Total Tarif</Text>
              <Text style={styles.receiptValBold}>Rp {currentPrice.toLocaleString('id-ID')}</Text>
            </View>
            {selectedPayment === 'gopay' && (
              <>
                <View style={styles.divider} />
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Sisa Saldo GoPay</Text>
                  <Text style={styles.receiptVal}>
                    Rp {Math.max(0, currentBalance - currentPrice).toLocaleString('id-ID')}
                  </Text>
                </View>
              </>
            )}
          </View>

          <Text style={styles.driverRewardText}>Saldo driver bertambah Rp {currentPrice.toLocaleString('id-ID')}!</Text>

          <TouchableOpacity 
            style={styles.doneBtn}
            onPress={() => navigation.navigate('RatingReview', {
              driverName: driverName,
              service: 'GoRide',
              orderId: 'ORDER-GR-58392'
            })}
          >
            <Text style={styles.doneBtnText}>Beri Penilaian & Selesai</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleCancel}>
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {driverState === 'coming' && 'Driver Menuju Lokasi'}
          {driverState === 'arrived' && 'Driver Tiba'}
          {driverState === 'trip' && 'Dalam Perjalanan'}
        </Text>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.navigate('EmergencySOS', {
            service: 'GoRide',
            driverName: driverName,
            orderId: 'ORDER-GR-58392'
          })}
        >
          <Shield color={furapColors.error} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.fullMapContainer}>
        {/* Simulated Tracking Map */}
        <MockGoogleMap 
          mode="track_ride"
          driverState={driverState}
          progress={driverProgress}
        />

        {/* Floating Tracking Card */}
        <View style={styles.floatingTrackingCard}>
          <View style={styles.driverBriefInfo}>
            <View style={styles.driverAvatarContainer}>
              <User color={furapColors.primary} size={28} />
            </View>
            <View style={styles.driverTextDetails}>
              <Text style={styles.driverNameText}>{driverName}</Text>
              <View style={styles.driverRatingRow}>
                <Star color={furapColors.accent} fill={furapColors.accent} size={14} style={{ marginRight: 4 }} />
                <Text style={styles.ratingText}>{driverRating}</Text>
                <Text style={styles.plateText}> • {driverPlate}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.chatButton}
              onPress={() => navigation.navigate('ChatRoom', {
                senderName: driverName,
                vehicle: driverPlate,
                service: 'GoRide'
              })}
              activeOpacity={0.7}
            >
              <MessageSquare color="#FFFFFF" size={18} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Status Information */}
          <View style={styles.statusInfoBlock}>
            <Text style={styles.statusHeadline}>
              {driverState === 'coming' && 'Driver sedang menjemputmu'}
              {driverState === 'arrived' && 'Driver telah sampai di titik jemput!'}
              {driverState === 'trip' && 'Sedang dalam perjalanan ke tujuan'}
            </Text>
            
            <View style={styles.trackingProgressBarContainer}>
              <View style={[styles.trackingProgressBar, { 
                width: `${driverProgress}%`,
                backgroundColor: driverState === 'trip' ? '#3B82F6' : '#10B981'
              }]} />
            </View>
            
            <Text style={styles.statusDetailText}>
              {driverState === 'coming' && `Estimasi tiba: ${Math.max(1, Math.round(5 - (driverProgress * 0.05)))} menit`}
              {driverState === 'arrived' && 'Harap segera menemui pengemudi.'}
              {driverState === 'trip' && `Sisa perjalanan: ${Math.max(1, Math.round(10 - (driverProgress * 0.1)))} menit`}
            </Text>
          </View>
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
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...furapTypography.headlineMd,
    fontSize: 18,
    color: furapColors.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  fullMapContainer: {
    flex: 1,
  },
  fullMapBackground: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#ECEEEF',
  },
  mapGridLinesFull: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ECEEEF',
  },
  mapRoad: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  landmarkPin: {
    position: 'absolute',
    alignItems: 'center',
  },
  customerMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
  landmarkText: {
    ...furapTypography.labelSm,
    fontSize: 10,
    color: furapColors.primary,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  driverMarkerContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    zIndex: -1,
  },
  floatingTrackingCard: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    ...furapGlass.card,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  driverBriefInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(26, 26, 26, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverTextDetails: {
    flex: 1,
  },
  driverNameText: {
    ...furapTypography.headlineMd,
    fontSize: 15,
    color: furapColors.primary,
  },
  driverRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    ...furapTypography.headlineMd,
    fontSize: 12,
    color: furapColors.primary,
  },
  plateText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
  },
  chatButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1A73E8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  statusInfoBlock: {
    marginTop: 14,
  },
  statusHeadline: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
    marginBottom: 8,
  },
  trackingProgressBarContainer: {
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(26, 26, 26, 0.05)',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  trackingProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  statusDetailText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.08)',
    marginVertical: 12,
  },

  // Completed State UI
  doneContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F7F7F8',
  },
  glassCardDone: {
    ...furapGlass.card,
    padding: 24,
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  successIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  doneHeading: {
    ...furapTypography.headlineMd,
    fontSize: 22,
    color: furapColors.primary,
    textAlign: 'center',
  },
  doneSubheading: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.neutral,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  receiptContainer: {
    width: '100%',
    backgroundColor: 'rgba(26, 26, 26, 0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  receiptLabel: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.neutral,
  },
  receiptVal: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.primary,
  },
  receiptValBold: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
  },
  driverRewardText: {
    ...furapTypography.headlineMd,
    fontSize: 13,
    color: '#10B981',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  doneBtn: {
    ...furapGlass.buttonPrimary,
    width: '100%',
    paddingVertical: 14,
  },
  doneBtnText: {
    ...furapTypography.buttonText,
    fontSize: 15,
  }
});
