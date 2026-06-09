import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  Alert 
} from 'react-native';
import { ChevronLeft, Info, Wallet, CreditCard, DollarSign, ArrowRight } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

export default function GoFoodCheckoutScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user = useAuthStore((state) => state.user);

  const { merchantName, items, totalPrice } = route.params || {
    merchantName: '',
    items: [],
    totalPrice: 0
  };

  const deliveryFee = 8000;
  const serviceFee = 2000;
  const grandTotal = totalPrice + deliveryFee + serviceFee;
  const currentBalance = user?.balance ?? 150000;

  const handleOrder = () => {
    if (currentBalance < grandTotal) {
      Alert.alert(
        'Saldo GoPay Kurang',
        `Total belanja Anda Rp ${grandTotal.toLocaleString('id-ID')}, sedangkan saldo GoPay Anda hanya Rp ${currentBalance.toLocaleString('id-ID')}. Silakan top up terlebih dahulu.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Navigate to matching driver screen
    navigation.navigate('GoFoodMatching', {
      merchantName,
      items,
      totalPrice,
      grandTotal
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout GoFood</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Merchant Info */}
        <Text style={styles.sectionTitle}>Pesanan Dari</Text>
        <View style={styles.merchantHeaderCard}>
          <Text style={styles.merchantName}>{merchantName}</Text>
          <Text style={styles.merchantDelivery}>Estimasi pengiriman: 20-30 menit</Text>
        </View>

        {/* Selected Items List */}
        <Text style={styles.sectionTitle}>Rincian Pesanan</Text>
        <View style={styles.itemsCard}>
          {items.map((item: any, idx: number) => (
            <View key={item.id}>
              <View style={styles.itemRow}>
                <Text style={styles.itemQty}>{item.qty}x</Text>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
                <Text style={styles.itemPrice}>Rp {(item.price * item.qty).toLocaleString('id-ID')}</Text>
              </View>
              {idx < items.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Pricing Summary */}
        <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ongkos Kirim</Text>
            <Text style={styles.summaryValue}>Rp {deliveryFee.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Biaya Layanan</Text>
            <Text style={styles.summaryValue}>Rp {serviceFee.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalValue}>Rp {grandTotal.toLocaleString('id-ID')}</Text>
          </View>
        </View>

        {/* Payment Warning & Forced GoPay */}
        <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
        
        {/* GoPay Option (Enabled & Active) */}
        <View style={[styles.paymentBtn, styles.paymentBtnActive]}>
          <Wallet color={furapColors.onPrimary} size={18} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.paymentBtnTextActive}>GoPay (Saldo: Rp {currentBalance.toLocaleString('id-ID')})</Text>
          </View>
        </View>

        {/* Disabled Payment Options */}
        <View style={[styles.paymentBtn, styles.paymentBtnDisabled]}>
          <CreditCard color={furapColors.neutral} size={18} style={{ marginRight: 10 }} />
          <Text style={styles.paymentBtnTextDisabled}>Transfer Rekening (Tidak tersedia untuk GoFood)</Text>
        </View>

        <View style={[styles.paymentBtn, styles.paymentBtnDisabled]}>
          <DollarSign color={furapColors.neutral} size={18} style={{ marginRight: 10 }} />
          <Text style={styles.paymentBtnTextDisabled}>Tunai / COD (Tidak tersedia untuk GoFood)</Text>
        </View>

        {/* Prominent Warning Box */}
        <View style={styles.warningBox}>
          <Info color={furapColors.error} size={18} style={{ marginRight: 10, marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.warningTitle}>Pembayaran Awal Wajib GoPay</Text>
            <Text style={styles.warningDesc}>
              Khusus layanan GoFood, pembayaran harus dilakukan di awal menggunakan saldo GoPay. Tidak tersedia pembayaran di akhir/COD demi keamanan transaksi merchant & driver.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Order Panel */}
      <View style={styles.bottomOrderPanel}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Belanja</Text>
          <Text style={styles.priceValue}>Rp {grandTotal.toLocaleString('id-ID')}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.submitOrderBtn}
          onPress={handleOrder}
        >
          <Text style={styles.submitOrderText}>Pesan Sekarang</Text>
          <ArrowRight color={furapColors.onPrimary} size={18} />
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
    marginBottom: 10,
    marginTop: 14,
  },
  merchantHeaderCard: {
    ...furapGlass.card,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  merchantName: {
    ...furapTypography.headlineMd,
    fontSize: 16,
    color: furapColors.primary,
  },
  merchantDelivery: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
    marginTop: 4,
  },
  itemsCard: {
    ...furapGlass.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemQty: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    ...furapTypography.bodyMd,
    fontSize: 14,
    color: furapColors.primary,
    fontWeight: '500',
  },
  itemPrice: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.08)',
  },
  summaryCard: {
    ...furapGlass.card,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.neutral,
  },
  summaryValue: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.primary,
  },
  totalLabel: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
  },
  totalValue: {
    ...furapTypography.displayLg,
    fontSize: 16,
    color: furapColors.primary,
  },
  paymentBtn: {
    ...furapGlass.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 8,
  },
  paymentBtnActive: {
    backgroundColor: furapColors.primary,
    borderColor: furapColors.primary,
  },
  paymentBtnDisabled: {
    backgroundColor: 'rgba(26, 26, 26, 0.03)',
    borderColor: 'rgba(26, 26, 26, 0.06)',
    opacity: 0.6,
  },
  paymentBtnTextActive: {
    ...furapTypography.headlineMd,
    fontSize: 13,
    color: '#FFFFFF',
  },
  paymentBtnTextDisabled: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(186, 26, 26, 0.05)',
    borderColor: 'rgba(186, 26, 26, 0.15)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    marginBottom: 20,
  },
  warningTitle: {
    ...furapTypography.headlineMd,
    fontSize: 13,
    color: furapColors.error,
  },
  warningDesc: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.error,
    marginTop: 4,
    lineHeight: 16,
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
    fontSize: 20,
    color: furapColors.primary,
  },
  submitOrderBtn: {
    ...furapGlass.buttonPrimary,
    height: 50,
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
