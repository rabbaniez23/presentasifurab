import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Platform, 
  ScrollView, 
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import { ChevronLeft, Search, ChevronRight, MessageSquare, Mail, Phone, ChevronDown } from 'lucide-react-native';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  { 
    id: '1', 
    question: 'Bagaimana cara melakukan Top Up GoPay?', 
    answer: 'Anda dapat melakukan Top Up GoPay melalui transfer bank Virtual Account (BCA, Mandiri, dll.), minimarket terdekat, atau langsung dari driver Furab Anda.' 
  },
  { 
    id: '2', 
    question: 'Mengapa pesanan GoFood saya terlambat?', 
    answer: 'Keterlambatan dapat disebabkan oleh antrean restoran yang padat atau kondisi lalu lintas/cuaca. Anda dapat memantau posisi driver secara real-time di halaman Tracking.' 
  },
  { 
    id: '3', 
    question: 'Bagaimana ketentuan pengembalian dana?', 
    answer: 'Refund akan diproses otomatis ke saldo GoPay Anda dalam waktu maksimal 1x24 jam apabila pesanan dibatalkan oleh restoran atau driver.' 
  },
  { 
    id: '4', 
    question: 'Bagaimana cara mengganti nomor telepon?', 
    answer: 'Anda dapat memperbarui nomor telepon Anda melalui menu Pengaturan Akun > Informasi Pribadi > No. Telepon, lalu simpan perubahan.' 
  }
];

export default function HelpCenterScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const filteredFaqs = FAQS.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Background Blobs */}
      <View style={styles.backgroundBlob1} />
      <View style={styles.backgroundBlob2} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pusat Bantuan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search color={furapColors.neutral} size={18} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Cari solusi atau masalah..."
            placeholderTextColor={furapColors.neutral}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* FAQs Accordion */}
        <Text style={styles.sectionTitle}>Pertanyaan Populer (FAQ)</Text>
        <View style={styles.glassCard}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <View key={faq.id}>
                  <TouchableOpacity 
                    style={styles.faqHeader} 
                    onPress={() => toggleFaq(faq.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    {isExpanded ? (
                      <ChevronDown color={furapColors.primary} size={18} />
                    ) : (
                      <ChevronRight color={furapColors.neutral} size={18} />
                    )}
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.faqAnswerContainer}>
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                  
                  {index < filteredFaqs.length - 1 && <View style={styles.divider} />}
                </View>
              );
            })
          ) : (
            <Text style={styles.noFaqs}>Tidak menemukan hasil yang cocok.</Text>
          )}
        </View>

        {/* Contact Support */}
        <Text style={styles.sectionTitle}>Hubungi Dukungan Furab</Text>
        
        {/* Live Chat */}
        <TouchableOpacity 
          style={styles.contactCard} 
          onPress={() => Alert.alert('Live Chat', 'Menghubungkan ke agen dukungan kami...')}
          activeOpacity={0.8}
        >
          <View style={styles.contactIconWrapper}>
            <MessageSquare color={furapColors.primary} size={20} />
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactTitle}>Live Chat 24/7</Text>
            <Text style={styles.contactDesc}>Bicara langsung dengan agen bantuan kami</Text>
          </View>
          <ChevronRight color={furapColors.neutral} size={18} />
        </TouchableOpacity>

        {/* Email */}
        <TouchableOpacity 
          style={styles.contactCard} 
          onPress={() => Alert.alert('Kirim Email', 'Membuka formulir pengiriman email tiket...')}
          activeOpacity={0.8}
        >
          <View style={styles.contactIconWrapper}>
            <Mail color={furapColors.primary} size={20} />
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactTitle}>Kirim Tiket Masalah</Text>
            <Text style={styles.contactDesc}>Tanggapan dalam kurun waktu 1-2 jam kerja</Text>
          </View>
          <ChevronRight color={furapColors.neutral} size={18} />
        </TouchableOpacity>

        {/* Phone Call */}
        <TouchableOpacity 
          style={styles.contactCard} 
          onPress={() => Alert.alert('Call Center', 'Menghubungi nomor darurat bantuan Furab...')}
          activeOpacity={0.8}
        >
          <View style={[styles.contactIconWrapper, { backgroundColor: 'rgba(255, 59, 48, 0.08)' }]}>
            <Phone color={furapColors.error} size={20} />
          </View>
          <View style={styles.contactDetails}>
            <Text style={[styles.contactTitle, { color: furapColors.error }]}>Call Center Darurat</Text>
            <Text style={styles.contactDesc}>Layanan cepat tanggap bantuan pelanggan</Text>
          </View>
          <ChevronRight color={furapColors.neutral} size={18} />
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
    backgroundColor: '#EAEAE9',
    opacity: 0.4,
    top: '10%',
    right: -80,
  },
  backgroundBlob2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#E1E2E2',
    opacity: 0.4,
    bottom: '15%',
    left: -80,
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...furapTypography.headlineMd,
    fontSize: 18,
    color: furapColors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    ...furapTypography.bodyMd,
    flex: 1,
    height: '100%',
    color: furapColors.primary,
    fontSize: 13,
  },
  sectionTitle: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
    marginBottom: 12,
  },
  glassCard: {
    ...furapGlass.card,
    padding: 16,
    marginBottom: 24,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  faqQuestion: {
    flex: 1,
    ...furapTypography.bodyMd,
    fontWeight: '600',
    color: furapColors.primary,
    fontSize: 13,
    paddingRight: 12,
  },
  faqAnswerContainer: {
    paddingBottom: 12,
    paddingHorizontal: 4,
  },
  faqAnswer: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.secondary,
    lineHeight: 18,
  },
  noFaqs: {
    ...furapTypography.bodyMd,
    color: furapColors.neutral,
    textAlign: 'center',
    paddingVertical: 12,
  },
  contactCard: {
    ...furapGlass.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
  },
  contactIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(26, 26, 26, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactDetails: {
    flex: 1,
  },
  contactTitle: {
    ...furapTypography.bodyMd,
    fontWeight: 'bold',
    color: furapColors.primary,
    fontSize: 13,
  },
  contactDesc: {
    ...furapTypography.bodyMd,
    fontSize: 11,
    color: furapColors.neutral,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.05)',
  },
});
