import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Platform,
  Alert
} from 'react-native';
import { ChevronLeft, Search, Star, Plus, Minus, ShoppingBag } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';

interface FoodItem {
  id: string;
  name: string;
  price: number;
  desc: string;
}

interface Merchant {
  id: string;
  name: string;
  rating: string;
  category: string;
  menu: FoodItem[];
}

export default function GoFoodSearchScreen() {
  const navigation = useNavigation<any>();
  
  const merchants: Merchant[] = [
    { 
      id: '1', 
      name: 'Ayam Geprek Gacor', 
      rating: '4.8', 
      category: 'Spicy, Chicken',
      menu: [
        { id: 'm1', name: 'Paket Geprek Gacor', price: 20000, desc: 'Ayam geprek + nasi + es teh manis' },
        { id: 'm2', name: 'Geprek Mozzarella', price: 25000, desc: 'Ayam geprek dengan keju mozzarella leleh' },
        { id: 'm3', name: 'Kulit Crispy Gacor', price: 12000, desc: 'Kulit ayam digoreng renyah dengan sambal' }
      ]
    },
    { 
      id: '2', 
      name: 'Kopi Kenangan Mantan', 
      rating: '4.9', 
      category: 'Coffee, Beverages',
      menu: [
        { id: 'm4', name: 'Es Kopi Kenangan Mantan', price: 18000, desc: 'Kopi susu gula aren khas Kenangan' },
        { id: 'm5', name: 'Kenangan Milk Tea', price: 22000, desc: 'Teh susu segar dengan topping boba kenyal' },
        { id: 'm6', name: 'Roti Cokelat Kenangan', price: 12000, desc: 'Roti lembut dengan isi cokelat melimpah' }
      ]
    },
    { 
      id: '3', 
      name: 'Sate Taichan Senayan', 
      rating: '4.7', 
      category: 'Satay, Meat',
      menu: [
        { id: 'm7', name: 'Sate Taichan Daging (10 Tusuk)', price: 25000, desc: 'Sate dada ayam bakar bumbu asam pedas gurih' },
        { id: 'm8', name: 'Sate Taichan Kulit (10 Tusuk)', price: 27000, desc: 'Sate kulit ayam kenyal renyah bakar gurih' },
        { id: 'm9', name: 'Lontong Pulen', price: 5000, desc: 'Lontong pelengkap sate taichan' }
      ]
    }
  ];

  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});

  const handleAddToCart = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId]--;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  const getCartDetails = () => {
    if (!selectedMerchant) return { items: [], total: 0, count: 0 };
    let total = 0;
    let count = 0;
    const items = selectedMerchant.menu.filter(item => cart[item.id] > 0).map(item => {
      const qty = cart[item.id];
      total += item.price * qty;
      count += qty;
      return { ...item, qty };
    });
    return { items, total, count };
  };

  const cartInfo = getCartDetails();

  const handleCheckout = () => {
    if (cartInfo.items.length === 0) {
      Alert.alert('Keranjang Kosong', 'Silakan pilih makanan terlebih dahulu sebelum melanjutkan.');
      return;
    }
    navigation.navigate('GoFoodCheckout', {
      merchantName: selectedMerchant?.name,
      items: cartInfo.items,
      totalPrice: cartInfo.total
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundBlob1} />
      <View style={styles.backgroundBlob2} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => {
            if (selectedMerchant) {
              setSelectedMerchant(null);
              setCart({});
            } else {
              navigation.goBack();
            }
          }}
        >
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedMerchant ? selectedMerchant.name : 'GoFood'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Restaurant List Mode */}
      {!selectedMerchant ? (
        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Mock Search Input */}
          <View style={styles.searchBarContainer}>
            <Search color={furapColors.neutral} size={18} style={{ marginRight: 10 }} />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Cari makanan favoritmu..." 
              placeholderTextColor={furapColors.neutral}
            />
          </View>

          <Text style={styles.sectionTitle}>Restoran Terdekat</Text>
          {merchants.map((merchant) => (
            <TouchableOpacity 
              key={merchant.id} 
              style={styles.merchantCard}
              onPress={() => navigation.navigate('MerchantDetail', {
                merchantId: merchant.id,
                merchantName: merchant.name
              })}
            >
              <View style={styles.merchantImagePlaceholder}>
                <ShoppingBag color={furapColors.neutral} size={24} />
              </View>
              <View style={styles.merchantInfo}>
                <Text style={styles.merchantName}>{merchant.name}</Text>
                <Text style={styles.merchantCategory}>{merchant.category}</Text>
                <View style={styles.ratingRow}>
                  <Star color={furapColors.accent} fill={furapColors.accent} size={14} style={{ marginRight: 4 }} />
                  <Text style={styles.ratingText}>{merchant.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        /* Merchant Menu Selection Mode */
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 160 }}>
            {selectedMerchant.menu.map((item) => {
              const qty = cart[item.id] || 0;
              return (
                <View key={item.id} style={styles.menuCard}>
                  <View style={styles.menuInfo}>
                    <Text style={styles.menuName}>{item.name}</Text>
                    <Text style={styles.menuDesc}>{item.desc}</Text>
                    <Text style={styles.menuPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
                  </View>
                  
                  {/* Cart Controls */}
                  <View style={styles.cartActionGroup}>
                    {qty > 0 ? (
                      <View style={styles.counterRow}>
                        <TouchableOpacity 
                          style={styles.counterBtn}
                          onPress={() => handleRemoveFromCart(item.id)}
                        >
                          <Minus color={furapColors.primary} size={14} />
                        </TouchableOpacity>
                        <Text style={styles.counterText}>{qty}</Text>
                        <TouchableOpacity 
                          style={styles.counterBtn}
                          onPress={() => handleAddToCart(item.id)}
                        >
                          <Plus color={furapColors.primary} size={14} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={styles.addBtn}
                        onPress={() => handleAddToCart(item.id)}
                      >
                        <Plus color={furapColors.onPrimary} size={16} style={{ marginRight: 4 }} />
                        <Text style={styles.addBtnText}>Tambah</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Bottom Cart Sheet */}
          {cartInfo.count > 0 && (
            <View style={styles.bottomCartSheet}>
              <View style={styles.cartSummary}>
                <View style={styles.cartIconWrapper}>
                  <ShoppingBag color={furapColors.onPrimary} size={20} />
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartInfo.count}</Text>
                  </View>
                </View>
                <View style={styles.cartTextDetails}>
                  <Text style={styles.cartTotalLabel}>Total Harga</Text>
                  <Text style={styles.cartTotalValue}>Rp {cartInfo.total.toLocaleString('id-ID')}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.checkoutBtn}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutBtnText}>Lanjut ke Pembayaran</Text>
              </TouchableOpacity>
            </View>
          )}
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
  backgroundBlob1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#DFE0E0',
    opacity: 0.5,
    top: -50,
    left: -50,
  },
  backgroundBlob2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#E6E5E4',
    opacity: 0.4,
    bottom: -60,
    right: -60,
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(26, 26, 26, 0.08)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    ...furapTypography.bodyMd,
    fontSize: 14,
    color: furapColors.primary,
    padding: 0,
  },
  sectionTitle: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
    marginBottom: 12,
  },
  merchantCard: {
    ...furapGlass.card,
    flexDirection: 'row',
    padding: 14,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  merchantImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: 'rgba(26, 26, 26, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  merchantInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  merchantName: {
    ...furapTypography.headlineMd,
    fontSize: 15,
    color: furapColors.primary,
  },
  merchantCategory: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    ...furapTypography.headlineMd,
    fontSize: 12,
    color: furapColors.primary,
  },

  // Menu Selection styles
  menuCard: {
    ...furapGlass.card,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    alignItems: 'center',
  },
  menuInfo: {
    flex: 1,
    paddingRight: 12,
  },
  menuName: {
    ...furapTypography.headlineMd,
    fontSize: 15,
    color: furapColors.primary,
  },
  menuDesc: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
    marginTop: 4,
    lineHeight: 16,
  },
  menuPrice: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
    marginTop: 8,
  },
  cartActionGroup: {
    alignItems: 'flex-end',
  },
  addBtn: {
    ...furapGlass.buttonPrimary,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addBtnText: {
    ...furapTypography.buttonText,
    fontSize: 13,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgba(26, 26, 26, 0.15)',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  counterBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
    marginHorizontal: 10,
  },

  // Bottom Cart Sheet
  bottomCartSheet: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  cartSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: furapColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: furapColors.error,
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cartTextDetails: {
    justifyContent: 'center',
  },
  cartTotalLabel: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
  },
  cartTotalValue: {
    ...furapTypography.displayLg,
    fontSize: 16,
    color: furapColors.primary,
    marginTop: 2,
  },
  checkoutBtn: {
    ...furapGlass.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  checkoutBtnText: {
    ...furapTypography.buttonText,
    fontSize: 14,
  }
});
