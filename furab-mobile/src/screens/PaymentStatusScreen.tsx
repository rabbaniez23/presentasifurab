import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../theme/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckCircle2, XCircle, Clock, CreditCard, Receipt } from 'lucide-react-native';

export default function PaymentStatusScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Params
  const { 
    paymentId = `PAY-${Math.floor(100000 + Math.random() * 900000)}`, 
    amount = 50000, 
    method = 'GoPay', 
    status = 'success' 
  } = route.params || {};

  // Local state
  const [isProcessing, setIsProcessing] = useState(true);

  // Time stamp
  const [timestamp] = useState(() => {
    const now = new Date();
    return now.toLocaleString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  });

  // 3 seconds simulation processing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setIsProcessing(true);
    // Restart simulation
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  if (isProcessing) {
    return (
      <View style={styles.container}>
        {/* Background Blobs */}
        <View style={styles.backgroundBlob1} />
        <View style={styles.backgroundBlob2} />

        <View style={styles.processingContent}>
          <ActivityIndicator size="large" color={furapColors.primary} style={{ marginBottom: 24 }} />
          <Text style={styles.processingTitle}>Memproses Pembayaran</Text>
          <Text style={styles.processingSubtitle}>Mohon tunggu sebentar, kami sedang memverifikasi transaksi Anda...</Text>
        </View>
      </View>
    );
  }

  const isSuccess = status === 'success';

  return (
    <View style={styles.container}>
      {/* Background Blobs */}
      <View style={styles.backgroundBlob1} />
      <View style={styles.backgroundBlob2} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {isSuccess ? (
          /* SUCCESS STATE */
          <View style={styles.statusCard}>
            <View style={styles.iconWrapperSuccess}>
              <CheckCircle2 color="#FFFFFF" size={56} />
            </View>
            <Text style={styles.statusTitleText}>Pembayaran Berhasil</Text>
            <Text style={styles.statusSubtitleText}>Transaksi Anda telah sukses diproses dan diverifikasi.</Text>

            {/* Receipt Details */}
            <View style={styles.receiptContainer}>
              <View style={styles.receiptHeader}>
                <Receipt color={furapColors.primary} size={18} style={{ marginRight: 8 }} />
                <Text style={styles.receiptHeaderTitle}>Rincian Transaksi</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>ID Pembayaran</Text>
                <Text style={styles.receiptValue}>{paymentId}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Metode</Text>
                <View style={styles.methodBadge}>
                  <CreditCard color={furapColors.primary} size={12} style={{ marginRight: 4 }} />
                  <Text style={styles.methodText}>{method}</Text>
                </View>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Waktu</Text>
                <View style={styles.timeContainer}>
                  <Clock color={furapColors.neutral} size={12} style={{ marginRight: 4 }} />
                  <Text style={styles.timeText}>{timestamp}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.receiptRow}>
                <Text style={styles.totalLabel}>Jumlah Bayar</Text>
                <Text style={styles.totalValue}>Rp {amount.toLocaleString('id-ID')}</Text>
              </View>
            </View>
          </View>
        ) : (
          /* FAILURE STATE */
          <View style={styles.statusCard}>
            <View style={styles.iconWrapperFailed}>
              <XCircle color="#FFFFFF" size={56} />
            </View>
            <Text style={[styles.statusTitleText, { color: furapColors.error }]}>Pembayaran Gagal</Text>
            <Text style={styles.statusSubtitleText}>
              Maaf, transaksi Anda gagal diproses karena kendala sistem atau jaringan.
            </Text>

            {/* Receipt details in fail for reference */}
            <View style={styles.receiptContainer}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>ID Pembayaran</Text>
                <Text style={styles.receiptValue}>{paymentId}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Jumlah Nominal</Text>
                <Text style={[styles.receiptValue, { fontWeight: 'bold' }]}>Rp {amount.toLocaleString('id-ID')}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={handleRetry}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Button: Kembali ke Beranda */}
        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
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
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#EAEAE9',
    opacity: 0.5,
    top: '10%',
    right: -50,
  },
  backgroundBlob2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#E1E2E2',
    opacity: 0.5,
    bottom: '15%',
    left: -50,
  },
  processingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  processingTitle: {
    ...furapTypography.headlineMd,
    color: furapColors.primary,
    fontSize: 20,
    marginBottom: 8,
  },
  processingSubtitle: {
    ...furapTypography.bodyMd,
    color: furapColors.neutral,
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  statusCard: {
    ...furapGlass.card,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapperSuccess: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  iconWrapperFailed: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: furapColors.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: furapColors.error,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  statusTitleText: {
    ...furapTypography.headlineMd,
    fontSize: 22,
    color: furapColors.primary,
    marginBottom: 8,
  },
  statusSubtitleText: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.neutral,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  receiptContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.05)',
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  receiptHeaderTitle: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  receiptLabel: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.neutral,
  },
  receiptValue: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.primary,
    fontWeight: '500',
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  methodText: {
    fontSize: 11,
    fontWeight: '600',
    color: furapColors.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: furapColors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.08)',
    marginVertical: 10,
  },
  totalLabel: {
    ...furapTypography.bodyMd,
    fontSize: 14,
    fontWeight: 'bold',
    color: furapColors.primary,
  },
  totalValue: {
    ...furapTypography.bodyMd,
    fontSize: 16,
    fontWeight: 'bold',
    color: furapColors.primary,
  },
  retryButton: {
    ...furapGlass.buttonPrimary,
    backgroundColor: furapColors.error,
    borderColor: furapColors.error,
    width: '100%',
    marginTop: 20,
  },
  retryButtonText: {
    ...furapTypography.buttonText,
  },
  homeButton: {
    ...furapGlass.buttonPrimary,
    backgroundColor: furapColors.primary,
  },
  homeButtonText: {
    ...furapTypography.buttonText,
  },
});
