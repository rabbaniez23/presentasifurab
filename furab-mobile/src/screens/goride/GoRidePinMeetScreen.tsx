import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MockGoogleMap from '../../components/MockGoogleMap';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';

export default function GoRidePinMeetScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { pickup, destination } = route.params || { pickup: 'Kampus Utama UPI', destination: '' };

  const handleProceed = () => {
    navigation.navigate('GoRideConfirm', { pickup, destination });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pilih Titik Jemput</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.fullMapContainer}>
        {/* Full Screen Interactive Simulated Map */}
        <MockGoogleMap>
          {/* Center Pin simulating meeting point adjustment */}
          <View style={styles.centerPinContainer}>
            <View style={styles.pinPulse} />
            <MapPin color={furapColors.primary} size={42} />
            <View style={styles.pinShadow} />
          </View>
        </MockGoogleMap>

        {/* Floating Meet Point Card */}
        <View style={styles.floatingMeetCard}>
          <View style={styles.meetHeader}>
            <MapPin color="#10B981" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.meetTitle} numberOfLines={1}>Titik Temu: {pickup}</Text>
          </View>
          <Text style={styles.meetSubtitle}>Geser peta untuk menyesuaikan posisi driver menjemputmu.</Text>
          
          <TouchableOpacity 
            style={styles.meetBtn}
            onPress={handleProceed}
          >
            <Text style={styles.meetBtnText}>Lanjut Pilih Layanan</Text>
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
  mapBuilding: {
    position: 'absolute',
    backgroundColor: '#DFE2E4',
    borderRadius: 6,
  },
  centerPinContainer: {
    position: 'absolute',
    top: '48%',
    left: '50%',
    marginLeft: -21,
    marginTop: -42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(26, 26, 26, 0.15)',
    zIndex: -1,
  },
  pinShadow: {
    width: 8,
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    marginTop: -2,
  },
  floatingMeetCard: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    ...furapGlass.card,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  meetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  meetTitle: {
    ...furapTypography.headlineMd,
    fontSize: 15,
    color: furapColors.primary,
    flex: 1,
  },
  meetSubtitle: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.neutral,
    marginBottom: 16,
  },
  meetBtn: {
    ...furapGlass.buttonPrimary,
    paddingVertical: 14,
  },
  meetBtnText: {
    ...furapTypography.buttonText,
    fontSize: 15,
  },
});
