import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { ChevronLeft, ShoppingBag } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import MockGoogleMap from '../../components/MockGoogleMap';

export default function GoFoodMatchingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { merchantName, items, totalPrice, grandTotal } = route.params || {};

  const [timer, setTimer] = useState(5);

  useEffect(() => {
    if (timer <= 0) {
      navigation.replace('GoFoodTracking', {
        merchantName,
        items,
        totalPrice,
        grandTotal
      });
    }
  }, [timer, navigation, merchantName, items, totalPrice, grandTotal]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <MockGoogleMap mode="search" merchantName={merchantName} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mencari Driver...</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.matchingContainer}>
        <View style={styles.radarWrapper}>
          <View style={[styles.radarCircle, { width: 100, height: 100, borderRadius: 50, opacity: 0.8 }]} />
          <View style={[styles.radarCircle, { width: 180, height: 180, borderRadius: 90, opacity: 0.5 }]} />
          <View style={[styles.radarCircle, { width: 260, height: 260, borderRadius: 130, opacity: 0.2 }]} />
          <View style={styles.radarCenter}>
            <ShoppingBag color={furapColors.primary} size={36} />
          </View>
        </View>

        <View style={styles.glassCard}>
          <Text style={styles.heading}>Mencocokkan Pengemudi GoFood</Text>
          <Text style={styles.subheading}>Mencari driver terdekat yang bersedia mengambil pesanan Anda di {merchantName}...</Text>
          
          <Text style={styles.timerText}>Menghubungkan dalam {timer} detik...</Text>

          <TouchableOpacity 
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelBtnText}>Batalkan Pesanan</Text>
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
  matchingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  radarWrapper: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 40,
  },
  radarCircle: {
    position: 'absolute',
    borderColor: 'rgba(26, 26, 26, 0.1)',
    borderWidth: 1.5,
  },
  radarCenter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  glassCard: {
    ...furapGlass.card,
    padding: 24,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
  },
  heading: {
    ...furapTypography.headlineMd,
    fontSize: 18,
    color: furapColors.primary,
    textAlign: 'center',
  },
  subheading: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.neutral,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  timerText: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
    marginBottom: 20,
  },
  cancelBtn: {
    ...furapGlass.buttonSecondary,
    width: '100%',
    borderColor: 'rgba(186, 26, 26, 0.2)',
    backgroundColor: 'rgba(186, 26, 26, 0.05)',
  },
  cancelBtnText: {
    ...furapTypography.buttonText,
    color: furapColors.error,
    fontSize: 14,
  },
});
