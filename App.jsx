import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './screens/loginScreen';
import HomeScreen from './screens/HomeScreen';
import MovieInfoScreen from "./screens/MovieInfoScreen";
import SignUpScreen from "./screens/SignupScreen";
import AccountInfoScreen from "./screens/AccountInfoScreen";
import ShowTimeScreen from "./screens/ShowTimesScreen";
import SeatSelectionScreen from "./screens/SeatSelectionScreen";
import ProductScreen from "./screens/ProductScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      {/* Đã bỏ AuthProvider để chỉ chạy giao diện */}
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />
          <Stack.Screen name="MovieInfo" component={MovieInfoScreen} options={{ title: 'Thông tin phim' }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Đăng ký' }} />
          <Stack.Screen name="AccountInfo" component={AccountInfoScreen} options={{ title: 'Thông tin tài khoản' }} />
          <Stack.Screen name="ShowTimes" component={ShowTimeScreen} options={{ title: 'Lịch chiếu' }} />
          <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} options={{ title: 'Chọn ghế' }} />
          <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ title: 'Sản phẩm' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;