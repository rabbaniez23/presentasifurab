import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { ChevronLeft, Send, Phone, ShieldCheck, MapPin } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { furapColors, furapTypography, furapGlass } from '../theme/theme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'driver';
  timestamp: string;
}

export default function ChatRoomScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { senderName = 'Budi (Driver)', vehicle = 'Honda Vario [D 4321 XYZ]', service = 'GoRide', merchantName = '' } = route.params || {};

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: service === 'GoRide' 
        ? `Halo kak, saya ${senderName} yang mengambil orderan GoRide kakak. Sedang menuju titik jemput ya.` 
        : `Halo kak, saya ${senderName} driver GoFood kakak. Sedang menuju ke ${merchantName} untuk memesan makanan ya.`,
      sender: 'driver',
      timestamp: '12:01 PM'
    }
  ]);

  const flatListRef = useRef<FlatList>(null);

  const getFormattedTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: getFormattedTime()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Trigger driver mock reply
    const textLower = inputText.toLowerCase();
    let replyText = 'Siap kak, mohon ditunggu ya.';

    if (textLower.includes('dimana') || textLower.includes('mana') || textLower.includes('posisi')) {
      replyText = service === 'GoRide' 
        ? 'Saya sudah dekat lokasi penjemputan kak, sekitar 1 menit lagi sampai.'
        : 'Ini masih antre di restoran kak, tapi sedang dibuatkan makanannya.';
    } else if (textLower.includes('sesuai') || textLower.includes('aplikasi') || textLower.includes('ok')) {
      replyText = 'Siap laksanakan, kak! Langsung saya proses.';
    } else if (textLower.includes('tol') || textLower.includes('parkir')) {
      replyText = 'Baik kak, untuk biaya tol/parkir nanti bisa ditambahkan di akhir ya.';
    }

    setTimeout(() => {
      const driverMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: 'driver',
        timestamp: getFormattedTime()
      };
      setMessages((prev) => [...prev, driverMessage]);
    }, 1500);
  };

  useEffect(() => {
    // Auto scroll to bottom when messages update
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.driverRow]}>
        {!isUser && (
          <View style={styles.avatarMini}>
            <Text style={styles.avatarMiniText}>{senderName.charAt(0)}</Text>
          </View>
        )}
        <View style={[
          styles.messageBubble, 
          isUser ? styles.userBubble : styles.driverBubble
        ]}>
          <Text style={[
            styles.messageText, 
            isUser ? styles.userText : styles.driverText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timeText, 
            isUser ? styles.userTimeText : styles.driverTimeText
          ]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft color={furapColors.primary} size={22} />
          </TouchableOpacity>
          <View style={styles.driverMeta}>
            <Text style={styles.driverName} numberOfLines={1}>{senderName}</Text>
            <Text style={styles.driverVehicle} numberOfLines={1}>
              {service === 'GoFood' ? `GoFood • ${merchantName || 'Merchant'}` : vehicle}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.callBtn} onPress={() => alert(`Memanggil ${senderName}...`)}>
          <Phone color={furapColors.primary} size={18} />
        </TouchableOpacity>
      </View>

      {/* Safety Banner */}
      <View style={styles.safetyBanner}>
        <ShieldCheck color="#10B981" size={14} style={{ marginRight: 6 }} />
        <Text style={styles.safetyText}>Percakapan dilindungi enkripsi Furab SafeGuard.</Text>
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Input bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={`Tulis pesan untuk ${senderName.split(' ')[0]}...`}
          placeholderTextColor={furapColors.neutral}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity 
          style={[styles.sendBtn, inputText.trim() === '' && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={inputText.trim() === ''}
        >
          <Send color={inputText.trim() === '' ? '#A0A3A6' : '#FFFFFF'} size={18} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray chat background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 26, 26, 0.06)',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  driverMeta: {
    flex: 1,
  },
  driverName: {
    ...furapTypography.headlineMd,
    fontSize: 16,
    color: furapColors.primary,
  },
  driverVehicle: {
    ...furapTypography.bodyMd,
    fontSize: 12,
    color: furapColors.neutral,
    marginTop: 2,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: 'rgba(26, 26, 26, 0.1)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  safetyText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Manrope-Regular' : 'sans-serif',
    color: '#2E7D32',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 6,
    maxWidth: '80%',
    alignItems: 'flex-end',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  driverRow: {
    alignSelf: 'flex-start',
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: furapColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  avatarMiniText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#1A73E8', // Premium Blue
    borderBottomRightRadius: 2,
  },
  driverBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 2,
    borderColor: 'rgba(0,0,0,0.05)',
    borderWidth: 0.5,
  },
  messageText: {
    ...furapTypography.bodyMd,
    fontSize: 14,
    lineHeight: 18,
  },
  userText: {
    color: '#FFFFFF',
  },
  driverText: {
    color: '#1A1A1A',
  },
  timeText: {
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  userTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  driverTimeText: {
    color: furapColors.neutral,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(26, 26, 26, 0.06)',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1A1A1A',
    maxHeight: 100,
    marginRight: 10,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A73E8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  sendBtnDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
});
