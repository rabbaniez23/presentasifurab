import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import GoRideSearchScreen from '../screens/goride/GoRideSearchScreen';
import GoRidePinMeetScreen from '../screens/goride/GoRidePinMeetScreen';
import GoRideConfirmScreen from '../screens/goride/GoRideConfirmScreen';
import GoRideSearchingScreen from '../screens/goride/GoRideSearchingScreen';
import GoRideTrackingScreen from '../screens/goride/GoRideTrackingScreen';
import GoFoodSearchScreen from '../screens/gofood/GoFoodSearchScreen';
import GoFoodCheckoutScreen from '../screens/gofood/GoFoodCheckoutScreen';
import GoFoodMatchingScreen from '../screens/gofood/GoFoodMatchingScreen';
import GoFoodTrackingScreen from '../screens/gofood/GoFoodTrackingScreen';
import MerchantDetailScreen from '../screens/gofood/MerchantDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import GoPayDetailScreen from '../screens/gopay/GoPayDetailScreen';
import GoPayTopUpScreen from '../screens/gopay/GoPayTopUpScreen';
import GoPayTransferScreen from '../screens/gopay/GoPayTransferScreen';
import NotificationListScreen from '../screens/NotificationListScreen';
import PromoListScreen from '../screens/PromoListScreen';
import RatingReviewScreen from '../screens/RatingReviewScreen';
import PaymentStatusScreen from '../screens/PaymentStatusScreen';
import EmergencySOSScreen from '../screens/EmergencySOSScreen';
import AccountSettingsScreen from '../screens/profile/AccountSettingsScreen';
import PaymentMethodsScreen from '../screens/profile/PaymentMethodsScreen';

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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GoRide" component={GoRideSearchScreen} />
        <Stack.Screen name="GoRidePinMeet" component={GoRidePinMeetScreen} />
        <Stack.Screen name="GoRideConfirm" component={GoRideConfirmScreen} />
        <Stack.Screen name="GoRideSearching" component={GoRideSearchingScreen} />
        <Stack.Screen name="GoRideTracking" component={GoRideTrackingScreen} />
        <Stack.Screen name="GoFood" component={GoFoodSearchScreen} />
        <Stack.Screen name="MerchantDetail" component={MerchantDetailScreen} />
        <Stack.Screen name="GoFoodCheckout" component={GoFoodCheckoutScreen} />
        <Stack.Screen name="GoFoodMatching" component={GoFoodMatchingScreen} />
        <Stack.Screen name="GoFoodTracking" component={GoFoodTrackingScreen} />
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
        <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
        <Stack.Screen name="GoPayDetail" component={GoPayDetailScreen} />
        <Stack.Screen name="GoPayTopUp" component={GoPayTopUpScreen} />
        <Stack.Screen name="GoPayTransfer" component={GoPayTransferScreen} />
        <Stack.Screen name="NotificationList" component={NotificationListScreen} />
        <Stack.Screen name="PromoList" component={PromoListScreen} />
        <Stack.Screen name="RatingReview" component={RatingReviewScreen} />
        <Stack.Screen name="PaymentStatus" component={PaymentStatusScreen} />
        <Stack.Screen name="EmergencySOS" component={EmergencySOSScreen} />
        <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
