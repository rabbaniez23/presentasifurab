import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { ChevronLeft, Car } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MockGoogleMap from '../../components/MockGoogleMap';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';

export default function GoRideSearchingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { pickup, destination, selectedPackage, selectedPayment } = route.params || {};

  const [searchRadius, setSearchRadius] = useState(5);
  const [searchTimer, setSearchTimer] = useState(120);

  useEffect(() => {
    const interval = setInterval(() => {
      setSearchTimer((prev) => {
        if (prev <= 10) {
          clearInterval(interval);
          navigation.replace('GoRideTracking', {
            pickup,
            destination,
            selectedPackage,
            selectedPayment
          });
          return 0;
        }
        return prev - 20;
      });

      setSearchRadius((prev) => {
        if (prev >= 20) return 20;
        return prev + 5;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <MockGoogleMap mode="search" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mencari Driver...</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchingContainer}>
        <View style={styles.searchRadarWrapper}>
          <View style={[styles.radarCircle, { width: 100, height: 100, borderRadius: 50, opacity: 0.8 }]} />
          <View style={[styles.radarCircle, { width: 180, height: 180, borderRadius: 90, opacity: 0.5 }]} />
          <View style={[styles.radarCircle, { width: 260, height: 260, borderRadius: 130, opacity: 0.2 }]} />
          <View style={styles.radarCenter}>
            <Car color={furapColors.primary} size={36} />
          </View>
        </View>

        <View style={styles.glassCardSearch}>
          <Text style={styles.searchHeading}>Menghubungkan ke Pengemudi</Text>
          <Text style={styles.searchSubheading}>Sinyal Anda sedang dikirim ke driver terdekat...</Text>
          
          <View style={styles.radarStatsGroup}>
            <View style={styles.radarStatItem}>
              <Text style={styles.statLabel}>Radius Pencarian</Text>
              <Text style={styles.statValue}>{searchRadius} KM</Text>
            </View>
            <View style={styles.radarStatItem}>
              <Text style={styles.statLabel}>Waktu Tunggu</Text>
              <Text style={styles.statValue}>{searchTimer}s</Text>
            </View>
          </View>

          <View style={styles.radiusProgressBarContainer}>
            <View style={[styles.radiusProgressBar, { width: `${(searchRadius / 20) * 100}%` }]} />
          </View>
          <Text style={styles.searchRadiusLimitText}>Maksimal radius pencarian: 20 KM</Text>

          <TouchableOpacity 
            style={styles.cancelSearchBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelSearchBtnText}>Batalkan Pencarian</Text>
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
  searchingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  searchRadarWrapper: {
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
  glassCardSearch: {
    ...furapGlass.card,
    padding: 24,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
  },
  searchHeading: {
    ...furapTypography.headlineMd,
    fontSize: 18,
    color: furapColors.primary,
    textAlign: 'center',
  },
  searchSubheading: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.neutral,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  radarStatsGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  radarStatItem: {
    width: '48%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(26, 26, 26, 0.03)',
  },
  statLabel: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
  },
  statValue: {
    ...furapTypography.headlineMd,
    fontSize: 16,
    color: furapColors.primary,
    marginTop: 2,
  },
  radiusProgressBarContainer: {
    height: 6,
    width: '100%',
    backgroundColor: 'rgba(26, 26, 26, 0.08)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  radiusProgressBar: {
    height: '100%',
    backgroundColor: furapColors.primary,
    borderRadius: 3,
  },
  searchRadiusLimitText: {
    ...furapTypography.bodyMd,
    fontSize: 10,
    color: furapColors.neutral,
    marginBottom: 24,
  },
  cancelSearchBtn: {
    ...furapGlass.buttonSecondary,
    width: '100%',
    borderColor: 'rgba(186, 26, 26, 0.2)',
    backgroundColor: 'rgba(186, 26, 26, 0.05)',
  },
  cancelSearchBtnText: {
    ...furapTypography.buttonText,
    color: furapColors.error,
    fontSize: 14,
  },
});
