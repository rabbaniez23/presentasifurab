import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  TextInput, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { furapColors, furapTypography, furapGlass } from '../theme/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, Star, User, DollarSign } from 'lucide-react-native';

const TAG_PRESETS = ['Ramah', 'Cepat', 'Bersih', 'Aman'];
const TIP_PRESETS = [2000, 5000, 10000];

export default function RatingReviewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Params
  const { driverName = 'Budi Setiawan', service = 'GoRide', orderId = 'ORDER-GR-58392' } = route.params || {};

  // Auth store for balance deduction if user tips the driver
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const currentBalance = user?.balance ?? 150000;

  // Local state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSelectTipPreset = (amount: number) => {
    setSelectedTip(amount);
    setCustomTip('');
  };

  const handleCustomTipChange = (val: string) => {
    setCustomTip(val);
    setSelectedTip(null);
  };

  const calculateTipAmount = (): number => {
    if (selectedTip !== null) return selectedTip;
    const parsedCustom = parseInt(customTip.replace(/[^0-9]/g, ''), 10);
    return isNaN(parsedCustom) ? 0 : parsedCustom;
  };

  const handleSubmit = () => {
    const tipAmount = calculateTipAmount();

    // Check if user has enough balance for the tip
    if (tipAmount > currentBalance) {
      Alert.alert('Saldo Tidak Cukup', 'Saldo GoPay Anda tidak mencukupi untuk memberi tip sebesar ini.');
      return;
    }

    setLoading(true);

    // Simulate API submission
    setTimeout(() => {
      setLoading(false);

      // Deduct tip from balance if any
      if (tipAmount > 0) {
        const newBalance = Math.max(0, currentBalance - tipAmount);
        setUser({ ...user, balance: newBalance });
      }

      Alert.alert(
        'Penilaian Dikirim',
        `Terima kasih! Penilaian bintang ${rating} Anda untuk driver ${driverName} telah berhasil dikirim.${
          tipAmount > 0 ? ` Tip sebesar Rp ${tipAmount.toLocaleString('id-ID')} telah dipotong dari GoPay Anda.` : ''
        }`,
        [{ text: 'Kembali ke Beranda', onPress: () => navigation.navigate('Home') }]
      );
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Background blobs */}
      <View style={styles.backgroundBlob1} />
      <View style={styles.backgroundBlob2} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.7}
        >
          <ArrowLeft color={furapColors.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rating & Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Driver Profile Summary */}
        <View style={styles.driverSection}>
          <View style={styles.avatarContainer}>
            <User color={furapColors.primary} size={36} />
          </View>
          <Text style={styles.serviceText}>{service} • {orderId}</Text>
          <Text style={styles.driverName}>{driverName}</Text>
        </View>

        {/* Stars Selector */}
        <View style={styles.starsContainer}>
          <Text style={styles.questionText}>Bagaimana perjalanan Anda?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((starNum) => {
              const isActive = starNum <= rating;
              return (
                <TouchableOpacity
                  key={starNum}
                  onPress={() => setRating(starNum)}
                  activeOpacity={0.7}
                  style={styles.starTouch}
                >
                  <Star 
                    color={isActive ? furapColors.accent : '#AEAEB2'} 
                    fill={isActive ? furapColors.accent : 'transparent'} 
                    size={36} 
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Tags Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Berikan Tag Penilaian</Text>
          <View style={styles.tagsRow}>
            {TAG_PRESETS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagChip, isSelected && styles.tagChipActive]}
                  onPress={() => toggleTag(tag)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tagText, isSelected && styles.tagTextActive]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Custom Comment Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Komentar Tambahan</Text>
          <TextInput
            style={styles.commentInput}
            multiline
            numberOfLines={4}
            placeholder="Tulis kritik & saran untuk meningkatkan layanan kami..."
            placeholderTextColor={furapColors.neutral}
            value={comment}
            onChangeText={setComment}
          />
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <View style={styles.tipTitleRow}>
            <Text style={styles.sectionTitle}>Beri Tip ke Driver?</Text>
            <Text style={styles.balanceInfoText}>GoPay: Rp {currentBalance.toLocaleString('id-ID')}</Text>
          </View>
          
          <View style={styles.tipsRow}>
            {TIP_PRESETS.map((amount) => {
              const isSelected = selectedTip === amount;
              return (
                <TouchableOpacity
                  key={amount}
                  style={[styles.tipChip, isSelected && styles.tipChipActive]}
                  onPress={() => handleSelectTipPreset(amount)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tipText, isSelected && styles.tipTextActive]}>
                    Rp {amount.toLocaleString('id-ID')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Tip Input */}
          <View style={styles.customTipContainer}>
            <DollarSign color={furapColors.primary} size={18} style={styles.customTipIcon} />
            <TextInput
              style={styles.customTipInput}
              keyboardType="number-pad"
              placeholder="Jumlah tip kustom lainnya"
              placeholderTextColor={furapColors.neutral}
              value={customTip}
              onChangeText={handleCustomTipChange}
            />
          </View>
        </View>

        {/* Submit button */}
        <TouchableOpacity 
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={furapColors.onPrimary} size="small" />
          ) : (
            <Text style={styles.submitBtnText}>Kirim Penilaian</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#E9E8E7',
    opacity: 0.5,
    top: '5%',
    right: -60,
  },
  backgroundBlob2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#DFE0E0',
    opacity: 0.5,
    bottom: '10%',
    left: -60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  headerTitle: {
    ...furapTypography.headlineMd,
    color: furapColors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  driverSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  serviceText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  driverName: {
    ...furapTypography.headlineMd,
    fontSize: 20,
    color: furapColors.primary,
  },
  starsContainer: {
    ...furapGlass.card,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  questionText: {
    ...furapTypography.bodyMd,
    fontWeight: '600',
    color: furapColors.primary,
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starTouch: {
    paddingHorizontal: 8,
  },
  section: {
    ...furapGlass.card,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.08)',
  },
  tagChipActive: {
    backgroundColor: furapColors.primary,
    borderColor: furapColors.primary,
  },
  tagText: {
    ...furapTypography.bodyMd,
    fontSize: 13,
    color: furapColors.secondary,
  },
  tagTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  commentInput: {
    ...furapGlass.input,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    textAlignVertical: 'top',
    fontSize: 14,
  },
  tipTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceInfoText: {
    fontSize: 11,
    color: furapColors.neutral,
    fontWeight: '500',
  },
  tipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tipChip: {
    width: '31%',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.08)',
  },
  tipChipActive: {
    backgroundColor: furapColors.primary,
    borderColor: furapColors.primary,
  },
  tipText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    fontWeight: '600',
    color: furapColors.primary,
  },
  tipTextActive: {
    color: '#FFFFFF',
  },
  customTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    ...furapGlass.input,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    height: 46,
    paddingHorizontal: 10,
  },
  customTipIcon: {
    marginRight: 6,
    opacity: 0.6,
  },
  customTipInput: {
    flex: 1,
    height: '100%',
    color: furapColors.primary,
    fontSize: 13,
  },
  submitBtn: {
    ...furapGlass.buttonPrimary,
    backgroundColor: furapColors.primary,
    marginTop: 8,
  },
  submitBtnText: {
    ...furapTypography.buttonText,
  },
});
