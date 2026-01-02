import React, { useRef, useEffect } from "react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { restoreToken } from '../store/slices/authSlice';

// Stacks
import AuthStack from "./stacks/AuthStack";
import BottomNavigation from "./BottomNavigation";

// Other Screens (Global / Modal)
import CategoryProductsScreen from "../screens/Home/Category/CategoryProductsScreen";
import SearchBarScreen from "../screens/CommonScreen/SearchBarScreen";
import SpareScreen from "../screens/Home/SpareScreen";
import ProductDetailScreen from "../screens/CommonScreen/ProductDetailScreen";
import MyProduct from "../screens/CommonScreen/MyProduct";
import OrderDetailScreen from "../screens/Home/Order/OrderDetailScreen";
import HelpCentre from "../screens/Home/Profile/HelpCentre";

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUserData = await AsyncStorage.getItem('userData');

        if (storedToken && storedUserData) {
          dispatch(restoreToken({
            token: storedToken,
            user: JSON.parse(storedUserData)
          }));
        }
      } catch (error) {
        console.error('Error restoring session:', error);
      } finally {
        setIsReady(true);
      }
    };

    checkToken();
  }, [dispatch]);

  if (!isReady) {
    // Optionally return a splash screen or loading indicator here
    return null;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRoute = navigationRef.getCurrentRoute();
        const currentRouteName = currentRoute?.name;
        const currentParams = currentRoute?.params;

        if (previousRouteName !== currentRouteName) {
          console.log(`[Navigation] Navigated to: ${currentRouteName}`);
          if (currentParams) {
            console.log(`[Navigation] Data:`, JSON.stringify(currentParams, null, 2));
          } else {
            console.log(`[Navigation] Data: None`);
          }
        }
        routeNameRef.current = currentRouteName;
      }}
    >
      <Stack.Navigator
        initialRouteName={token ? "Main" : "Auth"}
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: 'white' }
        }}
      >
        {token ? (
          <>
            {/* Main App (Bottom Tabs) */}
            <Stack.Screen name="Main" component={BottomNavigation} />

            {/* Global screens / Overlays that might be accessed from anywhere */}
            <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
            <Stack.Screen name="SpareScreen" component={SpareScreen} />
            <Stack.Screen name="SearchBarScreen" component={SearchBarScreen} />
            <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
            <Stack.Screen name="MyProduct" component={MyProduct} />
            <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
            <Stack.Screen name="HelpCentre" component={HelpCentre} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
