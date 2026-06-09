import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform 
} from 'react-native';
import { ChevronLeft, MapPin, Calendar, Clock, CreditCard, User, Star, Receipt, ArrowRight, ShoppingBag } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../theme/theme';

export default function ActivityDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { activity = {} } = route.params || {};

  // Standard fallback data
  const isFood = activity.type === 'food' || activity.name?.includes('Bistro') || activity.name?.includes('Market') || activity.name?.includes('Coffee');
  
  const title = activity.name || (isFood ? 'McD Setiabudi' : 'Perjalanan GoRide');
  const price = activity.priceVal || activity.price || 18000;
  const time = activity.time || 'Hari ini, 12:30';

  // Mocked details based on service type
  const driverName = isFood ? 'Dedi Kusnadi' : 'Budi Sudarsono';
  const driverRating = '4.9';
  const vehicle = isFood ? 'Honda Beat (D 9876 KLM)' : 'Yamaha NMax (D 5678 XYZ)';
  
  const routeDetails = isFood ? {
    pickup: 'McDonald\'s Setiabudi, Bandung',
    destination: 'Kampus Utama UPI (Asrama), Setiabudi'
  } : {
    pickup: 'Kampus Utama UPI, Bandung',
    destination: 'Cihampelas Walk (Ciwalk), Bandung'
  };

  const foodItems = [
    { name: 'Paket Geprek Gacor', qty: 2, price: 20000 },
    { name: 'Kulit Crispy Gacor', qty: 1, price: 12000 }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Aktivitas</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.typeBadge, { backgroundColor: isFood ? '#FFF3E0' : '#E8F5E9' }]}>
              <Text style={[styles.typeBadgeText, { color: isFood ? '#E65100' : '#2E7D32' }]}>
                {isFood ? 'GoFood' : 'GoRide'}
              </Text>
            </View>
            <View style={styles.successBadge}>
              <Text style={styles.successBadgeText}>Selesai</Text>
            </View>
          </View>
          
          <Text style={styles.merchantName}>{title}</Text>
          
          <View style={styles.timeMetaRow}>
            <Calendar color={furapColors.neutral} size={14} style={{ marginRight: 6 }} />
            <Text style={styles.timeMetaText}>{time}</Text>
          </View>
        </View>

        {/* Route / Location Card */}
        <Text style={styles.sectionTitle}>Rute Perjalanan</Text>
        <View style={styles.routeCard}>
          <View style={styles.routeTimeline}>
            <View style={[styles.timelineNode, { backgroundColor: '#10B981' }]} />
            <View style={styles.timelineLine} />
            <View style={[styles.timelineNode, { backgroundColor: '#EF4444' }]} />
          </View>
          
          <View style={styles.routeDetails}>
            <View style={styles.routePoint}>
              <Text style={styles.routeLabel}>{isFood ? 'Asal (Merchant)' : 'Titik Penjemputan'}</Text>
              <Text style={styles.routeAddress} numberOfLines={2}>{routeDetails.pickup}</Text>
            </View>
            <View style={[styles.routePoint, { marginTop: 16 }]}>
              <Text style={styles.routeLabel}>{isFood ? 'Tujuan Pengantaran' : 'Titik Tujuan'}</Text>
              <Text style={styles.routeAddress} numberOfLines={2}>{routeDetails.destination}</Text>
            </View>
          </View>
        </View>

        {/* Driver/Partner Details */}
        <Text style={styles.sectionTitle}>Mitra Pengemudi</Text>
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <User color={furapColors.primary} size={24} />
          </View>
          <View style={styles.driverMeta}>
            <Text style={styles.driverNameText}>{driverName}</Text>
            <Text style={styles.driverVehicleText}>{vehicle}</Text>
            <View style={styles.driverRatingRow}>
              <Star color={furapColors.accent} fill={furapColors.accent} size={13} style={{ marginRight: 4 }} />
              <Text style={styles.driverRatingText}>{driverRating}</Text>
            </View>
          </View>
        </View>

        {/* Purchased Items (GoFood Only) */}
        {isFood && (
          <>
            <Text style={styles.sectionTitle}>Pesanan Makanan</Text>
            <View style={styles.itemsCard}>
              {foodItems.map((item, index) => (
                <View key={index}>
                  <View style={styles.foodItemRow}>
                    <Text style={styles.foodItemQty}>{item.qty}x</Text>
                    <Text style={styles.foodItemName}>{item.name}</Text>
                    <Text style={styles.foodItemPrice}>Rp {(item.qty * item.price).toLocaleString('id-ID')}</Text>
                  </View>
                  {index < foodItems.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Receipt/Fare Breakdown Card */}
        <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
        <View style={styles.receiptCard}>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{isFood ? 'Subtotal Makanan' : 'Tarif Perjalanan'}</Text>
            <Text style={styles.receiptValue}>
              Rp {(isFood ? 52000 : price - 2000).toLocaleString('id-ID')}
            </Text>
          </View>
          
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{isFood ? 'Biaya Ongkir' : 'Biaya Layanan'}</Text>
            <Text style={styles.receiptValue}>
              Rp {(isFood ? 12000 : 2000).toLocaleString('id-ID')}
            </Text>
          </View>

          {isFood && (
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Biaya Layanan & Pemesanan</Text>
              <Text style={styles.receiptValue}>Rp 3.000</Text>
            </View>
          )}

          <View style={styles.divider} />
          
          <View style={[styles.receiptRow, { marginTop: 8 }]}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalValue}>
              Rp {isFood ? '67.000' : price.toLocaleString('id-ID')}
            </Text>
          </View>

          <View style={styles.paymentMethodRow}>
            <CreditCard color={furapColors.primary} size={16} style={{ marginRight: 8 }} />
            <Text style={styles.paymentMethodText}>Metode Pembayaran: **GoPay**</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 26, 26, 0.06)',
    zIndex: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...furapTypography.headlineMd,
    fontSize: 18,
    color: furapColors.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusCard: {
    ...furapGlass.card,
    backgroundColor: '#FFFFFF',
    padding: 18,
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Manrope-Bold' : 'sans-serif-medium',
  },
  successBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  successBadgeText: {
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: 'bold',
  },
  merchantName: {
    ...furapTypography.headlineMd,
    fontSize: 18,
    color: furapColors.primary,
  },
  timeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timeMetaText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
  },
  sectionTitle: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
    marginBottom: 8,
    marginLeft: 4,
  },
  routeCard: {
    ...furapGlass.card,
    backgroundColor: '#FFFFFF',
    padding: 18,
    flexDirection: 'row',
    marginBottom: 20,
  },
  routeTimeline: {
    alignItems: 'center',
    marginRight: 14,
    paddingVertical: 4,
  },
  timelineNode: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  routeDetails: {
    flex: 1,
  },
  routePoint: {
    justifyContent: 'center',
  },
  routeLabel: {
    fontSize: 11,
    color: furapColors.neutral,
    fontWeight: '600',
  },
  routeAddress: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.primary,
    marginTop: 2,
  },
  driverCard: {
    ...furapGlass.card,
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(26,26,26,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  driverMeta: {
    flex: 1,
  },
  driverNameText: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
  },
  driverVehicleText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
    marginTop: 2,
  },
  driverRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  driverRatingText: {
    ...furapTypography.headlineMd,
    fontSize: 11,
    color: furapColors.primary,
  },
  itemsCard: {
    ...furapGlass.card,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  foodItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  foodItemQty: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
    marginRight: 10,
    width: 20,
  },
  foodItemName: {
    flex: 1,
    ...furapTypography.bodyMd,
    fontSize: 14,
    color: furapColors.primary,
  },
  foodItemPrice: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  receiptCard: {
    ...furapGlass.card,
    backgroundColor: '#FFFFFF',
    padding: 18,
    marginBottom: 20,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
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
  },
  totalLabel: {
    ...furapTypography.headlineMd,
    fontSize: 15,
    color: furapColors.primary,
  },
  totalValue: {
    ...furapTypography.headlineMd,
    fontSize: 18,
    color: furapColors.primary,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  paymentMethodText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.secondary,
  },
});
