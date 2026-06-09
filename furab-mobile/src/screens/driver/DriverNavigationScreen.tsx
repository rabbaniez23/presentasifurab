import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Shield, Phone, MessageSquare, Navigation, MapPin } from 'lucide-react-native';
import MockGoogleMap from '../../components/MockGoogleMap';

type TripState = 'menuju_pickup' | 'di_lokasi' | 'dalam_perjalanan' | 'selesai';

export default function DriverNavigationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { 
    orderId = 'ORD-123',
    pickupAddress = 'Alamat Pickup',
    destinationAddress = 'Alamat Tujuan',
    customerName = 'Budi Santoso',
    serviceType = 'goride'
  } = route.params || {};

  const [tripState, setTripState] = useState<TripState>('menuju_pickup');
  const [eta, setEta] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => (prev > 1 ? prev - 1 : 1));
    }, 60000); // Turun 1 menit tiap 60 detik
    return () => clearInterval(timer);
  }, []);

  const handleNextState = () => {
    switch (tripState) {
      case 'menuju_pickup':
        setTripState('di_lokasi');
        setEta(0);
        break;
      case 'di_lokasi':
        setTripState('dalam_perjalanan');
        setEta(15); // ETA baru untuk tujuan
        break;
      case 'dalam_perjalanan':
        setTripState('selesai');
        navigation.replace('DriverRating', { orderId, customerName, serviceType, earnings: 18000 });
        break;
      default:
        break;
    }
  };

  const getStatusText = () => {
    switch (tripState) {
      case 'menuju_pickup': return 'Menuju Lokasi Penjemputan';
      case 'di_lokasi': return 'Menunggu Penumpang';
      case 'dalam_perjalanan': return 'Mengantar ke Tujuan';
      case 'selesai': return 'Trip Selesai';
    }
  };

  const getButtonText = () => {
    switch (tripState) {
      case 'menuju_pickup': return 'Sudah di Lokasi';
      case 'di_lokasi': return 'Mulai Perjalanan';
      case 'dalam_perjalanan': return 'Selesaikan Trip';
      case 'selesai': return 'Selesai';
    }
  };

  const getCurrentAddress = () => {
    return tripState === 'dalam_perjalanan' ? destinationAddress : pickupAddress;
  };

  return (
    <View style={styles.container}>
      {/* Floating Header */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
          <TouchableOpacity 
            style={styles.sosBtn}
            onPress={() => navigation.navigate('EmergencySOS')}
          >
            <Shield color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Map Area */}
      <View style={styles.mapContainer}>
        <MockGoogleMap />
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        {/* Destination Info */}
        <View style={styles.routeBox}>
          <View style={styles.routeIcon}>
            {tripState === 'dalam_perjalanan' ? (
              <MapPin color={furapColors.error} size={20} />
            ) : (
              <Navigation color={furapColors.primary} size={20} />
            )}
          </View>
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>
              {tripState === 'dalam_perjalanan' ? 'Tujuan' : 'Jemput di'}
            </Text>
            <Text style={styles.routeAddress}>{getCurrentAddress()}</Text>
          </View>
          {eta > 0 && (
            <View style={styles.etaBox}>
              <Text style={styles.etaValue}>{eta}</Text>
              <Text style={styles.etaUnit}>min</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Customer Info */}
        <View style={styles.customerRow}>
          <View style={styles.customerInfoLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{customerName.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.customerName}>{customerName}</Text>
              <Text style={styles.serviceType}>
                {serviceType === 'goride' ? 'GoRide' : 'GoFood'}
              </Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <TouchableOpacity 
              style={styles.contactBtn}
              onPress={() => navigation.navigate('ChatRoom', { senderName: customerName, service: serviceType })}
            >
              <MessageSquare color={furapColors.primary} size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}>
              <Phone color={furapColors.primary} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={[
            styles.actionBtn, 
            tripState === 'di_lokasi' && styles.actionBtnSecondary
          ]} 
          onPress={handleNextState}
        >
          <Text style={[
            styles.actionBtnText,
            tripState === 'di_lokasi' && styles.actionBtnTextSecondary
          ]}>
            {getButtonText()}
          </Text>
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
  mapContainer: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  statusBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusText: {
    ...furapTypography.labelMd,
    color: furapColors.primary,
  },
  sosBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: furapColors.error,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: furapColors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomPanel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30,30,30,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
  },
  routeAddress: {
    ...furapTypography.bodyMd,
    color: furapColors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  etaBox: {
    alignItems: 'center',
    backgroundColor: furapColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  etaValue: {
    ...furapTypography.labelLg,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  etaUnit: {
    ...furapTypography.bodySm,
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 20,
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  customerInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(30,30,30,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    ...furapTypography.labelLg,
    color: furapColors.primary,
  },
  customerName: {
    ...furapTypography.labelMd,
    color: furapColors.primary,
  },
  serviceType: {
    ...furapTypography.bodySm,
    color: furapColors.secondary,
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  contactBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30,30,30,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtn: {
    backgroundColor: furapColors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionBtnSecondary: {
    backgroundColor: furapColors.success,
  },
  actionBtnText: {
    ...furapTypography.labelMd,
    color: '#FFFFFF',
  },
  actionBtnTextSecondary: {
    color: '#FFFFFF',
  }
});
