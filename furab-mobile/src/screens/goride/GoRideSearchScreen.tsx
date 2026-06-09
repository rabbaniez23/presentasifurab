import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform 
} from 'react-native';
import { ChevronLeft, MapPin, Search, Home, Briefcase, Clock, ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../../theme/theme';
import MockGoogleMap from '../../components/MockGoogleMap';

export default function GoRideSearchScreen() {
  const navigation = useNavigation<any>();
  const [pickup, setPickup] = useState('Kampus Utama UPI');
  const [destination, setDestination] = useState('');
  
  const savedLocations = [
    { id: '1', title: 'Rumah', address: 'Jl. Setiabudi No. 229, Bandung', icon: Home },
    { id: '2', title: 'Kantor', address: 'Gedung Furab Core, Dago', icon: Briefcase }
  ];

  const history = [
    { id: '1', address: 'Cihampelas Walk, Bandung' },
    { id: '2', address: 'Bandung Indah Plaza' },
    { id: '3', address: 'Stasiun Bandung' }
  ];

  const handleSelectHistory = (address: string) => {
    navigation.navigate('GoRidePinMeet', { pickup, destination: address });
  };

  const handleSelectSaved = (address: string) => {
    navigation.navigate('GoRidePinMeet', { pickup, destination: address });
  };

  const handleProceed = () => {
    if (destination.trim() !== '') {
      navigation.navigate('GoRidePinMeet', { pickup, destination });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundBlob1} />
      <View style={styles.backgroundBlob2} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
          <ChevronLeft color={furapColors.primary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pesan GoRide</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* Map Preview Area */}
        <View style={styles.mapPreview}>
          <MockGoogleMap mode="search" />
        </View>

        {/* Search Inputs Card */}
        <View style={styles.glassCard}>
          <View style={styles.inputRow}>
            <View style={[styles.locationIndicator, { backgroundColor: '#10B981' }]} />
            <TextInput 
              style={styles.locationInput} 
              placeholder="Lokasi Jemput" 
              value={pickup} 
              onChangeText={setPickup}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.inputRow}>
            <View style={[styles.locationIndicator, { backgroundColor: '#EF4444' }]} />
            <TextInput 
              style={styles.locationInput} 
              placeholder="Mau pergi ke mana?" 
              value={destination} 
              onChangeText={setDestination}
              onSubmitEditing={handleProceed}
            />
            {destination.trim() !== '' && (
              <TouchableOpacity onPress={handleProceed} style={styles.searchSubmitBtn}>
                <ArrowRight color={furapColors.onPrimary} size={16} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Saved Addresses */}
        <Text style={styles.sectionTitle}>Alamat Simpanan</Text>
        <View style={styles.savedGroup}>
          {savedLocations.map((loc) => {
            const Icon = loc.icon;
            return (
              <TouchableOpacity 
                key={loc.id} 
                style={styles.savedItem}
                onPress={() => handleSelectSaved(loc.address)}
              >
                <View style={styles.savedIconContainer}>
                  <Icon color={furapColors.primary} size={18} />
                </View>
                <View style={styles.savedTextContent}>
                  <Text style={styles.savedTitle}>{loc.title}</Text>
                  <Text style={styles.savedAddress} numberOfLines={1}>{loc.address}</Text>
                </View>
                <ChevronLeft color={furapColors.neutral} size={16} style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* History */}
        <Text style={styles.sectionTitle}>Riwayat Perjalanan</Text>
        <View style={styles.historyCard}>
          {history.map((item, idx) => (
            <View key={item.id}>
              <TouchableOpacity 
                style={styles.historyItem}
                onPress={() => handleSelectHistory(item.address)}
              >
                <Clock color={furapColors.neutral} size={16} style={{ marginRight: 12 }} />
                <Text style={styles.historyText} numberOfLines={1}>{item.address}</Text>
              </TouchableOpacity>
              {idx < history.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
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
  mapPreview: {
    height: 160,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.05)',
  },
  mapGridLines: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F3F4F6',
  },
  mapRoad: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  mapRoadCircle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  mapPinIcon: {
    marginBottom: 8,
  },
  mapPreviewText: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
  },
  glassCard: {
    ...furapGlass.card,
    padding: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  locationIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  locationInput: {
    flex: 1,
    ...furapTypography.bodyMd,
    color: furapColors.primary,
    fontSize: 14,
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.08)',
    marginVertical: 4,
  },
  searchSubmitBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: furapColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sectionTitle: {
    ...furapTypography.labelSm,
    color: furapColors.neutral,
    marginBottom: 12,
  },
  savedGroup: {
    marginBottom: 24,
  },
  savedItem: {
    ...furapGlass.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  savedIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  savedTextContent: {
    flex: 1,
  },
  savedTitle: {
    ...furapTypography.headlineMd,
    fontSize: 14,
    color: furapColors.primary,
  },
  savedAddress: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
    marginTop: 2,
  },
  historyCard: {
    ...furapGlass.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  historyText: {
    flex: 1,
    ...furapTypography.bodyMd,
    fontSize: 14,
    color: furapColors.secondary,
  },
});
