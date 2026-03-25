import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LoginScreen from "./screens/loginScreen";
import HomeScreen from "./screens/HomeScreen";
import MovieInfoScreen from "./screens/MovieInfoScreen";
import SignUpScreen from "./screens/SignupScreen";
import AccountInfoScreen from "./screens/AccountInfoScreen";
import ShowTimeScreen from "./screens/ShowTimesScreen";
import SeatSelectionScreen from "./screens/SeatSelectionScreen";
import ProductScreen from "./screens/ProductScreen";
import PaymentMethodsScreen from "./screens/PaymentMethodsScreen";
import TicketConfirmationScreen from "./screens/TicketConfirmationScreen";
import TicketSuccessScreen from "./screens/TicketSuccessScreen";
import ChatAiScreen from "./screens/ChatAiScreen";
import WriteReviewScreen from "./screens/ReviewScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ChatAi" component={ChatAiScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MovieInfo" component={MovieInfoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "Đăng ký" }} />
          <Stack.Screen name="AccountInfo" component={AccountInfoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ShowTimes" component={ShowTimeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PaymentMethodsScreen" component={PaymentMethodsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TicketConfirmationScreen" component={TicketConfirmationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TicketSuccessScreen" component={TicketSuccessScreen} options={{ headerShown: false }} />
          <Stack.Screen name="WriteReview" component={WriteReviewScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;