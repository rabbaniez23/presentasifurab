import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  Alert,
  Modal
} from 'react-native';
import { ChevronLeft, MapPin, Car, Shield, Star, User, AlertTriangle, ShieldAlert, CheckCircle2, Phone, MessageSquare } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';
import MockGoogleMap from '../../components/MockGoogleMap';

type FoodTrackingState = 'ordering' | 'delivering' | 'arrived' | 'completed' | 'blacklisted';

export default function GoFoodTrackingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { merchantName, items, totalPrice, grandTotal } = route.params || {
    merchantName: 'Restoran',
    items: [],
    totalPrice: 0,
    grandTotal: 10000
  };

  const currentBalance = user?.balance ?? 150000;

  const [trackingState, setTrackingState] = useState<FoodTrackingState>('ordering');
  const [progress, setProgress] = useState(0);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  
  const [driverName] = useState('Budi Setiawan');
  const [driverPlate] = useState('D 4321 FUR');
  const [driverRating] = useState('4.9');

  // Deduct balance initially (pay in advance via GoPay)
  useEffect(() => {
    const newBalance = Math.max(0, currentBalance - grandTotal);
    setUser({ ...user, balance: newBalance });
  }, []);

  // Standard delivery progression simulation
  useEffect(() => {
    let interval: any;
    
    if (trackingState === 'ordering') {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTrackingState('delivering');
            setProgress(0);
            return 100;
          }
          return prev + 20; // speed up for presentation
        });
      }, 1000);
    } 
    
    else if (trackingState === 'delivering') {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTrackingState('arrived');
            setProgress(100);
            
            // Auto-complete order after 3 seconds from arrival
            setTimeout(() => {
              setTrackingState('completed');
            }, 3000);
            return 100;
          }
          return prev + 15;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [trackingState]);

  const handleReportCheating = () => {
    setReportModalVisible(false);
    Alert.alert(
      'Laporkan Kecurangan',
      'Apakah Anda yakin ingin melaporkan driver ini karena meminta biaya tambahan di luar aplikasi? Driver akan diblacklist permanen & saldo GoPay Anda akan direfund.',
      [
        { text: 'Batal' },
        { 
          text: 'Ya, Laporkan', 
          onPress: () => {
            setTrackingState('blacklisted');
            // Refund the full grandTotal back to the user
            const refundedBalance = currentBalance + grandTotal;
            setUser({ ...user, balance: refundedBalance });

            Alert.alert(
              '🚫 Driver Di-blacklist',
              `Driver ${driverName} telah resmi di-blacklist permanen dari Furab Super-App. Saldo GoPay sebesar Rp ${grandTotal.toLocaleString('id-ID')} telah dikembalikan 100% ke akun Anda.`,
              [{ text: 'Kembali ke Beranda', onPress: () => navigation.navigate('Home') }]
            );
          } 
        }
      ]
    );
  };

  const handleSelectOtherIssues = (issue: string) => {
    setReportModalVisible(false);
    Alert.alert('Bantuan', `Laporan Anda mengenai "${issue}" telah dikirim ke CS. Kami akan segera menghubungi Anda.`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => {
            if (trackingState !== 'completed' && trackingState !== 'blacklisted') {
              Alert.alert('Keluar Halaman', 'Kembali ke beranda? Pesanan Anda tetap berjalan di latar belakang.', [
                { text: 'Tidak' },
                { text: 'Ya', onPress: () => navigation.navigate('Home') }
              ]);
            } else {
              navigation.navigate('Home');
            }
          }}
        >
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {trackingState === 'ordering' && 'Driver Menuju Resto'}
          {trackingState === 'delivering' && 'Pesanan Sedang Diantar'}
          {trackingState === 'arrived' && 'Driver Sampai'}
        </Text>
        
        <TouchableOpacity 
          style={styles.helpBtn}
          onPress={() => setReportModalVisible(true)}
        >
          <Text style={styles.helpBtnText}>Bantuan</Text>
        </TouchableOpacity>
      </View>

      {/* Map and Info Layout (Delivering/Ordering state) */}
      {trackingState !== 'blacklisted' && trackingState !== 'completed' && (
        <View style={styles.fullMapContainer}>
          {/* Simulated Map */}
          <MockGoogleMap 
            mode="track_food"
            driverState={trackingState}
            progress={progress}
            merchantName={merchantName}
          />

          {/* Floating Tracking Card */}
          <View style={styles.floatingCard}>
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
              
              {/* Call & Chat options */}
              <View style={styles.contactRow}>
                <TouchableOpacity 
                  style={styles.contactBtn}
                  onPress={() => alert(`Memanggil ${driverName}...`)}
                >
                  <Phone color={furapColors.primary} size={16} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.contactBtn, { marginLeft: 8 }]}
                  onPress={() => navigation.navigate('ChatRoom', {
                    senderName: driverName,
                    vehicle: driverPlate,
                    service: 'GoFood',
                    merchantName: merchantName
                  })}
                >
                  <MessageSquare color={furapColors.primary} size={16} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statusBlock}>
              <Text style={styles.statusHeadline}>
                {trackingState === 'ordering' && 'Driver sedang memesan makanan di resto...'}
                {trackingState === 'delivering' && 'Driver sedang mengantar pesananmu...'}
                {trackingState === 'arrived' && 'Driver tiba di lokasi pengantaran!'}
              </Text>
              
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
              </View>
              
              <Text style={styles.statusDetailText}>
                {trackingState === 'ordering' && 'Driver sedang memproses pesanan di kasir.'}
                {trackingState === 'delivering' && 'Pesanan sedang dikirim ke alamat Anda.'}
                {trackingState === 'arrived' && 'Harap bersiap mengambil makanan.'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* NORMAL COMPLETED SCREEN */}
      {trackingState === 'completed' && (
        <View style={styles.resultScreenContainer}>
          <View style={styles.glassCardResult}>
            <View style={styles.successIconWrapper}>
              <CheckCircle2 color="#FFFFFF" size={48} />
            </View>

            <Text style={styles.resultHeading}>Pesanan Sukses Diterima!</Text>
            <Text style={styles.resultSubheading}>
              Makanan Anda dari **{merchantName}** telah sukses diantarkan oleh pengemudi.
            </Text>

            <View style={styles.receiptDetailsCard}>
              <Text style={styles.receiptTitle}>Rincian Pembayaran</Text>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Total Belanja</Text>
                <Text style={styles.receiptVal}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Ongkos Kirim & Layanan</Text>
                <Text style={styles.receiptVal}>Rp 10.000</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.receiptRow}>
                <Text style={styles.totalLabel}>Sudah Dibayar (GoPay)</Text>
                <Text style={styles.totalVal}>Rp {grandTotal.toLocaleString('id-ID')}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.doneBtn}
              onPress={() => navigation.navigate('RatingReview', {
                driverName: driverName,
                service: 'GoFood',
                orderId: 'ORDER-GF-94827'
              })}
            >
              <Text style={styles.doneBtnText}>Beri Penilaian & Selesai</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* BLACKLISTED AND REFUNDED SCREEN */}
      {trackingState === 'blacklisted' && (
        <View style={styles.resultScreenContainer}>
          <View style={styles.glassCardResult}>
            <View style={[styles.successIconWrapper, { backgroundColor: furapColors.error }]}>
              <ShieldAlert color="#FFFFFF" size={48} />
            </View>

            <Text style={styles.resultHeading}>Driver Berhasil Diblacklist!</Text>
            <Text style={styles.resultSubheading}>
              Driver **{driverName}** ({driverPlate}) telah dibanned permanen karena terbukti melakukan kecurangan (meminta markup tambahan).
            </Text>

            <View style={styles.punishmentBox}>
              <Text style={styles.punishmentText}>🚫 Akun driver diblokir permanen dari sistem.</Text>
              <Text style={styles.punishmentText}>💰 Saldo GoPay Anda telah direfund 100%.</Text>
            </View>

            <View style={styles.refundBox}>
              <Text style={styles.refundLabel}>Refund Saldo GoPay</Text>
              <Text style={styles.refundVal}>+Rp {grandTotal.toLocaleString('id-ID')}</Text>
              <Text style={styles.balanceInfoText}>Saldo GoPay Sekarang: Rp {currentBalance.toLocaleString('id-ID')}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.doneBtn, { backgroundColor: furapColors.error, borderColor: furapColors.error }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.doneBtnText}>Kembali ke Beranda</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* HELP & REPORT MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bantuan & Masalah Pesanan</Text>
            <Text style={styles.modalSubtitle}>Pilih kendala yang Anda alami saat ini:</Text>

            {/* Cheating selection */}
            <TouchableOpacity 
              style={styles.modalOptionBtnAlert}
              onPress={handleReportCheating}
            >
              <AlertTriangle color={furapColors.error} size={18} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.modalOptionTitleAlert}>Driver meminta tambahan biaya (Curang)</Text>
                <Text style={styles.modalOptionDescAlert}>Laporkan driver curang & dapatkan refund instan.</Text>
              </View>
            </TouchableOpacity>

            {/* Other standard issues */}
            <TouchableOpacity 
              style={styles.modalOptionBtn}
              onPress={() => handleSelectOtherIssues('Driver salah rute')}
            >
              <Text style={styles.modalOptionText}>Driver salah rute atau terlalu lama</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOptionBtn}
              onPress={() => handleSelectOtherIssues('Pesanan tidak sesuai')}
            >
              <Text style={styles.modalOptionText}>Pesanan tidak sesuai dengan aplikasi</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOptionBtn}
              onPress={() => handleSelectOtherIssues('Driver tidak dapat dihubungi')}
            >
              <Text style={styles.modalOptionText}>Driver tidak membalas chat / telepon</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.closeModalBtn}
              onPress={() => setReportModalVisible(false)}
            >
              <Text style={styles.closeModalBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(26, 26, 26, 0.05)',
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(26, 26, 26, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...furapTypography.headlineMd,
    fontSize: 16,
    color: furapColors.primary,
  },
  helpBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(186, 26, 26, 0.05)',
  },
  helpBtnText: {
    ...furapTypography.headlineMd,
    fontSize: 12,
    color: furapColors.error,
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
  floatingCard: {
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 14,
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
  contactRow: {
    flexDirection: 'row',
  },
  contactBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(26, 26, 26, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.08)',
    marginVertical: 12,
  },
  statusBlock: {
    marginTop: 2,
  },
  statusHeadline: {
    ...furapTypography.headlineMd,
    fontSize: 13,
    color: furapColors.primary,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(26, 26, 26, 0.05)',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  statusDetailText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
  },

  // Completed/Blacklisted Screen
  resultScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
  },
  glassCardResult: {
    ...furapGlass.card,
    padding: 24,
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  successIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  resultHeading: {
    ...furapTypography.headlineMd,
    fontSize: 20,
    color: furapColors.primary,
    textAlign: 'center',
  },
  resultSubheading: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.neutral,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  receiptDetailsCard: {
    width: '100%',
    backgroundColor: 'rgba(26, 26, 26, 0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  receiptTitle: {
    ...furapTypography.headlineMd,
    fontSize: 13,
    color: furapColors.primary,
    marginBottom: 10,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  receiptLabel: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
  },
  receiptVal: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.primary,
  },
  totalLabel: {
    ...furapTypography.headlineMd,
    fontSize: 13,
    color: furapColors.primary,
  },
  totalVal: {
    ...furapTypography.headlineMd,
    fontSize: 13,
    color: furapColors.primary,
  },
  punishmentBox: {
    width: '100%',
    backgroundColor: 'rgba(186, 26, 26, 0.04)',
    borderColor: 'rgba(186, 26, 26, 0.1)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  punishmentText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.error,
    marginVertical: 3,
  },
  refundBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  refundLabel: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
  },
  refundVal: {
    ...furapTypography.displayLg,
    fontSize: 22,
    color: '#10B981',
    marginTop: 2,
  },
  balanceInfoText: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
    marginTop: 2,
  },
  doneBtn: {
    ...furapGlass.buttonPrimary,
    width: '100%',
    paddingVertical: 14,
  },
  doneBtnText: {
    ...furapTypography.buttonText,
    fontSize: 15,
  },

  // Modal Help styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalTitle: {
    ...furapTypography.headlineMd,
    fontSize: 16,
    color: furapColors.primary,
  },
  modalSubtitle: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.neutral,
    marginTop: 4,
    marginBottom: 16,
  },
  modalOptionBtnAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(186, 26, 26, 0.05)',
    borderColor: 'rgba(186, 26, 26, 0.12)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  modalOptionTitleAlert: {
    ...furapTypography.headlineMd,
    fontSize: 13,
    color: furapColors.error,
  },
  modalOptionDescAlert: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.error,
    marginTop: 2,
  },
  modalOptionBtn: {
    paddingVertical: 14,
    borderBottomColor: 'rgba(26, 26, 26, 0.05)',
    borderBottomWidth: 1,
  },
  modalOptionText: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.primary,
  },
  closeModalBtn: {
    ...furapGlass.buttonSecondary,
    marginTop: 16,
    paddingVertical: 12,
  },
  closeModalBtnText: {
    ...furapTypography.buttonText,
    fontSize: 14,
    color: furapColors.primary,
  },
});
