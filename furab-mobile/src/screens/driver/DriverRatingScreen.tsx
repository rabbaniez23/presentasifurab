import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckCircle2, Star, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DriverRatingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { 
    orderId = 'ORD-123',
    customerName = 'Budi Santoso',
    serviceType = 'goride',
    earnings = 18000
  } = route.params || {};

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    navigation.replace('DriverHome');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <CheckCircle2 color={furapColors.success} size={64} />
        </View>

        <Text style={styles.title}>Trip Selesai!</Text>
        <Text style={styles.subtitle}>Terima kasih telah menyelesaikan pesanan ini.</Text>

        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Pendapatan Trip Ini</Text>
          <Text style={styles.earningsAmount}>Rp {earnings.toLocaleString('id-ID')}</Text>
          <View style={styles.earningsDetail}>
            <Text style={styles.detailText}>{serviceType === 'goride' ? '🛵 GoRide' : '🍕 GoFood'}</Text>
            <View style={styles.dot} />
            <Text style={styles.detailText}>{orderId}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.customerCard}>
          <View style={styles.avatar}>
            <User color={furapColors.primary} size={24} />
          </View>
          <View>
            <Text style={styles.customerName}>{customerName}</Text>
            <Text style={styles.customerRole}>Penumpang</Text>
          </View>
        </View>

        {/* Rating Section */}
        <Text style={styles.ratingPrompt}>Beri penilaian untuk penumpang</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
              <Star 
                color={star <= rating ? furapColors.warning : furapColors.neutral} 
                size={40} 
                fill={star <= rating ? furapColors.warning : 'transparent'} 
                style={styles.starIcon}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Comment Input */}
        <TextInput
          style={styles.commentInput}
          placeholder="Tambahkan komentar opsional..."
          placeholderTextColor={furapColors.neutral}
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
          <Text style={styles.submitBtnText}>Selesai & Kembali</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  title: {
    ...furapTypography.displayMd,
    color: furapColors.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...furapTypography.bodyMd,
    color: furapColors.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  earningsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  earningsLabel: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
    marginBottom: 8,
  },
  earningsAmount: {
    ...furapTypography.displayLg,
    color: furapColors.primary,
    marginBottom: 12,
  },
  earningsDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    ...furapTypography.bodySm,
    color: furapColors.secondary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: furapColors.neutral,
    marginHorizontal: 8,
  },
  customerCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(30, 30, 30, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  customerName: {
    ...furapTypography.labelMd,
    color: furapColors.primary,
  },
  customerRole: {
    ...furapTypography.bodySm,
    color: furapColors.secondary,
    marginTop: 2,
  },
  ratingPrompt: {
    ...furapTypography.labelMd,
    color: furapColors.primary,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  starIcon: {
    marginHorizontal: 8,
  },
  commentInput: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    ...furapTypography.bodyMd,
    color: furapColors.primary,
    marginBottom: 32,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: furapColors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitBtnText: {
    ...furapTypography.labelLg,
    color: '#FFFFFF',
  }
});
