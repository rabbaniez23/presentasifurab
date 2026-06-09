import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  FlatList,
  Alert 
} from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  ArrowLeft, Star, Clock, Truck, Plus, Minus, 
  ShoppingBag, CheckCircle2, ChevronRight 
} from 'lucide-react-native';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  desc: string;
  category: 'makanan' | 'minuman' | 'promo';
}

const MOCK_MENUS: Record<string, MenuItem[]> = {
  '1': [ // Ayam Geprek Gacor
    { id: 'm1', name: 'Paket Geprek Gacor', price: 20000, desc: 'Ayam geprek + nasi hangat + es teh manis', category: 'makanan' },
    { id: 'm2', name: 'Geprek Mozzarella Extra', price: 25000, desc: 'Ayam geprek dengan keju mozzarella leleh melimpah', category: 'makanan' },
    { id: 'm3', name: 'Kulit Crispy Sambal Gacor', price: 12000, desc: 'Kulit ayam digoreng renyah garing dengan sambal khas', category: 'makanan' },
    { id: 'd1', name: 'Es Teh Manis Jumbo', price: 5000, desc: 'Es teh manis segar ukuran besar', category: 'minuman' },
    { id: 'd2', name: 'Es Jeruk Peras', price: 7000, desc: 'Es jeruk dari perasan buah asli', category: 'minuman' },
    { id: 'p1', name: 'Paket Berdua Gacor Hemat', price: 35000, desc: '2 Paket Geprek Gacor + 2 Es Teh Manis', category: 'promo' },
  ],
  '2': [ // Kopi Kenangan Mantan
    { id: 'm4', name: 'Es Kopi Kenangan Mantan', price: 18000, desc: 'Kopi susu gula aren khas Kenangan segar', category: 'minuman' },
    { id: 'm5', name: 'Kenangan Milk Tea Boba', price: 22000, desc: 'Teh susu segar dengan topping boba kenyal manis', category: 'minuman' },
    { id: 'm6', name: 'Roti Cokelat Klasik', price: 12000, desc: 'Roti lembut dengan isi cokelat premium melimpah', category: 'makanan' },
    { id: 'd3', name: 'Caramel Macchiato Ice', price: 24000, desc: 'Double shot espresso dengan saus caramel premium', category: 'minuman' },
    { id: 'p2', name: 'Promo Mantan Setia (2 Cup)', price: 30000, desc: '2 Cup Es Kopi Kenangan Mantan harga hemat', category: 'promo' },
  ],
  '3': [ // Sate Taichan Senayan
    { id: 'm7', name: 'Sate Taichan Daging (10 Tusuk)', price: 25000, desc: 'Sate dada ayam bakar bumbu asam pedas gurih', category: 'makanan' },
    { id: 'm8', name: 'Sate Taichan Kulit (10 Tusuk)', price: 27000, desc: 'Sate kulit ayam kenyal renyah bakar gurih mantap', category: 'makanan' },
    { id: 'm9', name: 'Lontong Pulen', price: 5000, desc: 'Lontong pelengkap sate taichan porsi pas', category: 'makanan' },
    { id: 'd4', name: 'Badak Soda Sarsaparilla', price: 12000, desc: 'Minuman soda legendaris menyegarkan', category: 'minuman' },
    { id: 'p3', name: 'Combo Taichan Kenyang', price: 28000, desc: '10 Sate Daging + Lontong + Es Teh Manis', category: 'promo' },
  ],
};

export default function MerchantDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Params
  const { merchantId = '1', merchantName = 'Ayam Geprek Gacor' } = route.params || {};

  // Local state
  const [activeTab, setActiveTab] = useState<'makanan' | 'minuman' | 'promo'>('makanan');
  const [cart, setCart] = useState<Record<string, number>>({});

  const menus = MOCK_MENUS[merchantId] || MOCK_MENUS['1'];

  const handleAddToCart = (id: string) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id]--;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  // Cart calculation
  const getCartInfo = () => {
    let total = 0;
    let count = 0;
    const items = menus.filter(item => cart[item.id] > 0).map(item => {
      const qty = cart[item.id];
      total += item.price * qty;
      count += qty;
      return { ...item, qty };
    });
    return { items, total, count };
  };

  const cartInfo = getCartInfo();

  const handleCheckout = () => {
    if (cartInfo.items.length === 0) return;
    navigation.navigate('GoFoodCheckout', {
      merchantName: merchantName,
      items: cartInfo.items,
      totalPrice: cartInfo.total
    });
  };

  const filteredMenus = menus.filter(item => item.category === activeTab);

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Banner with Gradient overlay */}
        <View style={styles.heroBanner}>
          <View style={styles.bannerGradient} />
          
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>

        {/* Merchant Info Card */}
        <View style={styles.merchantCard}>
          <View style={styles.nameHeaderRow}>
            <Text style={styles.merchantNameText}>{merchantName}</Text>
            <View style={styles.verifiedBadge}>
              <CheckCircle2 color="#34C759" size={16} style={{ marginRight: 4 }} />
              <Text style={styles.verifiedText}>Terverifikasi</Text>
            </View>
          </View>

          <Text style={styles.categoryText}>Spicy • Ayam Geprek • Makanan Cepat Saji</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Star color={furapColors.accent} fill={furapColors.accent} size={15} style={{ marginRight: 4 }} />
              <Text style={styles.statVal}>4.8</Text>
              <Text style={styles.statLabel}> (500+ penilaian)</Text>
            </View>
            <Text style={styles.bullet}> • </Text>
            <Text style={styles.statVal}>1.2 km</Text>
            <Text style={styles.statLabel}> jarak tempuh</Text>
          </View>

          <View style={styles.divider} />

          {/* Delivery & Min Order Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailCol}>
              <Clock color={furapColors.neutral} size={16} style={{ marginBottom: 4 }} />
              <Text style={styles.detailTitle}>Jam Operasional</Text>
              <Text style={styles.detailValue}>09:00 - 21:00</Text>
            </View>
            <View style={styles.detailCol}>
              <Truck color={furapColors.neutral} size={16} style={{ marginBottom: 4 }} />
              <Text style={styles.detailTitle}>Estimasi Pengiriman</Text>
              <Text style={styles.detailValue}>15 - 25 mnt</Text>
            </View>
            <View style={styles.detailCol}>
              <ShoppingBag color={furapColors.neutral} size={16} style={{ marginBottom: 4 }} />
              <Text style={styles.detailTitle}>Min. Order</Text>
              <Text style={styles.detailValue}>Rp 10.000</Text>
            </View>
          </View>
        </View>

        {/* Tab Selection */}
        <View style={styles.tabsContainer}>
          {(['makanan', 'minuman', 'promo'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Menu Items List */}
        <View style={styles.menuSection}>
          {filteredMenus.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <View key={item.id} style={styles.menuItemCard}>
                <View style={styles.menuItemLeft}>
                  {/* Photo Placeholder */}
                  <View style={styles.photoPlaceholder}>
                    <ShoppingBag color={furapColors.neutral} size={22} />
                  </View>
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemDesc} numberOfLines={2}>{item.desc}</Text>
                    <Text style={styles.menuItemPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
                  </View>
                </View>

                {/* Plus / Minus Action Group */}
                <View style={styles.actionGroup}>
                  {qty > 0 ? (
                    <View style={styles.qtyContainer}>
                      <TouchableOpacity 
                        style={styles.qtyBtn} 
                        onPress={() => handleRemoveFromCart(item.id)}
                        activeOpacity={0.7}
                      >
                        <Minus color={furapColors.primary} size={14} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{qty}</Text>
                      <TouchableOpacity 
                        style={styles.qtyBtn} 
                        onPress={() => handleAddToCart(item.id)}
                        activeOpacity={0.7}
                      >
                        <Plus color={furapColors.primary} size={14} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.addBtn}
                      onPress={() => handleAddToCart(item.id)}
                      activeOpacity={0.7}
                    >
                      <Plus color="#FFFFFF" size={14} style={{ marginRight: 4 }} />
                      <Text style={styles.addBtnText}>Tambah</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Bottom Cart Bar */}
      {cartInfo.count > 0 && (
        <View style={styles.floatingCartContainer}>
          <TouchableOpacity 
            style={styles.floatingCartBar}
            onPress={handleCheckout}
            activeOpacity={0.9}
          >
            <View style={styles.cartBarLeft}>
              <View style={styles.cartIconBadge}>
                <ShoppingBag color={furapColors.primary} size={18} />
                <View style={styles.badgeDot}>
                  <Text style={styles.badgeDotText}>{cartInfo.count}</Text>
                </View>
              </View>
              <View style={styles.cartTextDetails}>
                <Text style={styles.cartCountText}>{cartInfo.count} item terpilih</Text>
                <Text style={styles.cartTotalText}>Rp {cartInfo.total.toLocaleString('id-ID')}</Text>
              </View>
            </View>
            
            <View style={styles.cartBarRight}>
              <Text style={styles.checkoutBtnText}>Checkout</Text>
              <ChevronRight color="#FFFFFF" size={18} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: furapColors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroBanner: {
    height: 180,
    backgroundColor: '#34495e',
  },
  bannerGradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(26, 26, 26, 0.4)',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 20,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  merchantCard: {
    ...furapGlass.card,
    marginTop: -30,
    marginHorizontal: 20,
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  nameHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  merchantNameText: {
    ...furapTypography.headlineMd,
    fontSize: 20,
    color: furapColors.primary,
    flex: 1,
    marginRight: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#34C759',
  },
  categoryText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statVal: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    fontWeight: 'bold',
    color: furapColors.primary,
  },
  statLabel: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
  },
  bullet: {
    color: furapColors.neutral,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.08)',
    marginVertical: 14,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCol: {
    width: '32%',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 10,
    color: furapColors.neutral,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: furapColors.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
    backgroundColor: 'rgba(26, 26, 26, 0.05)',
    borderRadius: 12,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabButtonText: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    fontWeight: '500',
    color: furapColors.secondary,
  },
  tabButtonTextActive: {
    color: furapColors.primary,
    fontWeight: 'bold',
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  menuItemCard: {
    ...furapGlass.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  photoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.05)',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemName: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
    fontSize: 14,
    marginBottom: 2,
  },
  menuItemDesc: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
    marginBottom: 4,
  },
  menuItemPrice: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    fontWeight: 'bold',
    color: furapColors.primary,
  },
  actionGroup: {
    alignItems: 'flex-end',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.1)',
    borderRadius: 10,
    padding: 2,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: furapColors.primary,
    paddingHorizontal: 8,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: furapColors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  floatingCartContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    zIndex: 100,
  },
  floatingCartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: furapColors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDotText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cartTextDetails: {
    justifyContent: 'center',
  },
  cartCountText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
  },
  cartTotalText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cartBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 4,
  },
});
