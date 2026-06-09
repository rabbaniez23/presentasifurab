import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MapPin, Navigation, Clock, CreditCard, User, Pizza } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DriverOrderRequestScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const { 
    orderId = 'ORD-123', 
    pickupAddress = 'Alamat Pickup', 
    destinationAddress = 'Alamat Tujuan', 
    distance = '2.5 km', 
    estimatedTime = '10 min', 
    price = 15000, 
    serviceType = 'goride', 
    customerName = 'Pelanggan' 
  } = route.params || {};

  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigation.replace('DriverHome');
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, navigation]);

  const handleAccept = () => {
    navigation.replace('DriverNavigation', {
      orderId,
      pickupAddress,
      destinationAddress,
      customerName,
      serviceType
    });
  };

  const handleDecline = () => {
    navigation.replace('DriverHome');
  };

  const progressWidth = (timeLeft / 15) * (width - 48);

  return (
    <View style={styles.container}>
      {/* Background Dim */}
      <View style={styles.backdrop} />

      {/* Main Card */}
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.serviceBadge}>
            <Text style={styles.serviceText}>
              {serviceType === 'goride' ? '🛵 GoRide' : '🍕 GoFood'}
            </Text>
          </View>
          <Text style={styles.price}>Rp {price.toLocaleString('id-ID')}</Text>
        </View>

        {/* Customer Info */}
        <View style={styles.customerRow}>
          <View style={styles.avatar}>
            <User color={furapColors.onPrimary} size={24} />
          </View>
          <View>
            <Text style={styles.customerName}>{customerName}</Text>
            <Text style={styles.orderId}>{orderId}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Route Info */}
        <View style={styles.routeContainer}>
          {/* Pickup */}
          <View style={styles.routeRow}>
            <View style={styles.iconContainer}>
              <View style={styles.dotPickup} />
            </View>
            <View style={styles.routeContent}>
              <Text style={styles.routeLabel}>Pick up</Text>
              <Text style={styles.routeAddress}>{pickupAddress}</Text>
            </View>
          </View>
          
          <View style={styles.routeLine} />

          {/* Destination */}
          <View style={styles.routeRow}>
            <View style={styles.iconContainer}>
              <MapPin color={furapColors.error} size={16} />
            </View>
            <View style={styles.routeContent}>
              <Text style={styles.routeLabel}>Drop off</Text>
              <Text style={styles.routeAddress}>{destinationAddress}</Text>
            </View>
          </View>
        </View>

        {/* GoFood specific items (Mock) */}
        {serviceType === 'gofood' && (
          <View style={styles.foodContainer}>
            <View style={styles.foodHeader}>
              <Pizza color={furapColors.secondary} size={16} style={{marginRight: 8}}/>
              <Text style={styles.foodLabel}>Detail Pesanan</Text>
            </View>
            <Text style={styles.foodItem}>1x Nasi Goreng Spesial</Text>
            <Text style={styles.foodItem}>2x Es Teh Manis</Text>
          </View>
        )}

        <View style={styles.divider} />

        {/* Trip Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Navigation color={furapColors.neutral} size={16} />
            <Text style={styles.statText}>{distance}</Text>
          </View>
          <View style={styles.statItem}>
            <Clock color={furapColors.neutral} size={16} />
            <Text style={styles.statText}>{estimatedTime}</Text>
          </View>
          <View style={styles.statItem}>
            <CreditCard color={furapColors.neutral} size={16} />
            <Text style={styles.statText}>GoPay</Text>
          </View>
        </View>

        {/* Timer Bar */}
        <View style={styles.timerContainer}>
          <View style={[styles.timerProgress, { width: progressWidth }]} />
        </View>
        <Text style={styles.timerText}>Menerima otomatis dalam {timeLeft} detik...</Text>

        {/* Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.declineBtn} onPress={handleDecline}>
            <Text style={styles.declineText}>Tolak</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
            <Text style={styles.acceptText}>Terima Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceBadge: {
    backgroundColor: 'rgba(30,30,30,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  serviceText: {
    ...furapTypography.labelSm,
    color: furapColors.primary,
  },
  price: {
    ...furapTypography.headingLg,
    color: furapColors.primary,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: furapColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  customerName: {
    ...furapTypography.labelLg,
    color: furapColors.primary,
  },
  orderId: {
    ...furapTypography.bodySm,
    color: furapColors.neutral,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
  routeContainer: {
    marginVertical: 8,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  dotPickup: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: furapColors.success,
  },
  routeContent: {
    flex: 1,
  },
  routeLabel: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
  },
  routeAddress: {
    ...furapTypography.bodyMd,
    color: furapColors.primary,
    marginTop: 2,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginLeft: 11,
    marginVertical: 4,
  },
  foodContainer: {
    backgroundColor: 'rgba(30,30,30,0.03)',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  foodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodLabel: {
    ...furapTypography.labelSm,
    color: furapColors.secondary,
  },
  foodItem: {
    ...furapTypography.bodySm,
    color: furapColors.primary,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    ...furapTypography.bodySm,
    color: furapColors.neutral,
    marginLeft: 8,
  },
  timerContainer: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    backgroundColor: furapColors.success,
  },
  timerText: {
    ...furapTypography.bodySm,
    color: furapColors.neutral,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginRight: 12,
  },
  declineText: {
    ...furapTypography.labelMd,
    color: furapColors.primary,
  },
  acceptBtn: {
    flex: 2,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: furapColors.success,
  },
  acceptText: {
    ...furapTypography.labelMd,
    color: '#FFFFFF',
  }
});
