import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ==========================================
// 1. Auth Screens
// ==========================================
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';

// ==========================================
// 2. GoFood Screens
// ==========================================
import GoFoodSearchScreen from '../screens/gofood/GoFoodSearchScreen';
import MerchantDetailScreen from '../screens/gofood/MerchantDetailScreen';
import GoFoodCheckoutScreen from '../screens/gofood/GoFoodCheckoutScreen';
import GoFoodMatchingScreen from '../screens/gofood/GoFoodMatchingScreen';
import GoFoodTrackingScreen from '../screens/gofood/GoFoodTrackingScreen';

// ==========================================
// 3. GoPay Screens
// ==========================================
import GoPayDetailScreen from '../screens/gopay/GoPayDetailScreen';
import GoPayTopUpScreen from '../screens/gopay/GoPayTopUpScreen';
import GoPayTransferScreen from '../screens/gopay/GoPayTransferScreen';
import GoPayTransactionHistoryScreen from '../screens/gopay/GoPayTransactionHistoryScreen';

// ==========================================
// 4. GoRide Screens
// ==========================================
import GoRideSearchScreen from '../screens/goride/GoRideSearchScreen';
import GoRidePinMeetScreen from '../screens/goride/GoRidePinMeetScreen';
import GoRideConfirmScreen from '../screens/goride/GoRideConfirmScreen';
import GoRideSearchingScreen from '../screens/goride/GoRideSearchingScreen';
import GoRideTrackingScreen from '../screens/goride/GoRideTrackingScreen';

// ==========================================
// 5. Profile Screens
// ==========================================
import AccountSettingsScreen from '../screens/profile/AccountSettingsScreen';
import HelpCenterScreen from '../screens/profile/HelpCenterScreen';
import PaymentMethodsScreen from '../screens/profile/PaymentMethodsScreen';

// ==========================================
// 6. Driver Screens
// ==========================================
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import DriverOrderRequestScreen from '../screens/driver/DriverOrderRequestScreen';
import DriverNavigationScreen from '../screens/driver/DriverNavigationScreen';
import DriverEarningsScreen from '../screens/driver/DriverEarningsScreen';
import DriverProfileScreen from '../screens/driver/DriverProfileScreen';
import DriverRatingScreen from '../screens/driver/DriverRatingScreen';

// ==========================================
// 7. Core / Root Screens
// ==========================================
import HomeScreen from '../screens/HomeScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import EmergencySOSScreen from '../screens/EmergencySOSScreen';
import NotificationListScreen from '../screens/NotificationListScreen';
import PaymentStatusScreen from '../screens/PaymentStatusScreen';
import PromoListScreen from '../screens/PromoListScreen';
import RatingReviewScreen from '../screens/RatingReviewScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* 1. Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />

        {/* 2. GoFood Screens */}
        <Stack.Screen name="GoFood" component={GoFoodSearchScreen} />
        <Stack.Screen name="MerchantDetail" component={MerchantDetailScreen} />
        <Stack.Screen name="GoFoodCheckout" component={GoFoodCheckoutScreen} />
        <Stack.Screen name="GoFoodMatching" component={GoFoodMatchingScreen} />
        <Stack.Screen name="GoFoodTracking" component={GoFoodTrackingScreen} />

        {/* 3. GoPay Screens */}
        <Stack.Screen name="GoPayDetail" component={GoPayDetailScreen} />
        <Stack.Screen name="GoPayTopUp" component={GoPayTopUpScreen} />
        <Stack.Screen name="GoPayTransfer" component={GoPayTransferScreen} />
        <Stack.Screen name="GoPayTransactionHistory" component={GoPayTransactionHistoryScreen} />

        {/* 4. GoRide Screens */}
        <Stack.Screen name="GoRide" component={GoRideSearchScreen} />
        <Stack.Screen name="GoRidePinMeet" component={GoRidePinMeetScreen} />
        <Stack.Screen name="GoRideConfirm" component={GoRideConfirmScreen} />
        <Stack.Screen name="GoRideSearching" component={GoRideSearchingScreen} />
        <Stack.Screen name="GoRideTracking" component={GoRideTrackingScreen} />

        {/* 5. Profile Screens */}
        <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />

        {/* 6. Driver Screens */}
        <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
        <Stack.Screen name="DriverOrderRequest" component={DriverOrderRequestScreen} />
        <Stack.Screen name="DriverNavigation" component={DriverNavigationScreen} />
        <Stack.Screen name="DriverEarnings" component={DriverEarningsScreen} />
        <Stack.Screen name="DriverProfile" component={DriverProfileScreen} />
        <Stack.Screen name="DriverRating" component={DriverRatingScreen} />

        {/* 7. Core / Root Screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
        <Stack.Screen name="EmergencySOS" component={EmergencySOSScreen} />
        <Stack.Screen name="NotificationList" component={NotificationListScreen} />
        <Stack.Screen name="PaymentStatus" component={PaymentStatusScreen} />
        <Stack.Screen name="PromoList" component={PromoListScreen} />
        <Stack.Screen name="RatingReview" component={RatingReviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
