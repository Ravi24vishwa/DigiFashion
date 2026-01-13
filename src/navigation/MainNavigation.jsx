import React, { useRef, useEffect } from "react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { restoreToken } from '../store/slices/authSlice';
import { STORAGE_KEYS } from '../constants';

// Stacks
import AuthStack from "./stacks/AuthStack";
import BottomNavigation from "./BottomNavigation";

// Other Screens (Global / Modal)
// Other Screens (Global / Modal)
import CategoryProductsScreen from "../screens/home/Category/CategoryProductsScreen";
import SearchBarScreen from "../screens/home/SearchBarScreen";
import ProductDetailScreen from "../screens/products/ProductDetailScreen";
import MyProduct from "../screens/products/MyProduct";
import OrderDetailScreen from "../screens/home/Order/OrderDetailScreen";
import HelpCentre from "../screens/profile/HelpCentre";

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  console.log(`[NAVIGATION-STATE] Current Token Status: ${token ? 'LOGGED_IN' : 'LOGGED_OUT'}`);
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    const checkToken = async () => {
      console.log('[FLOW-STEP 1] MainNavigation mounted. Checking stored token...');
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
        const storedUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (storedToken && storedUserData) {
          console.log('[FLOW-STEP 2] Found existing session. Restoring state...');
          dispatch(restoreToken({
            token: storedToken,
            user: JSON.parse(storedUserData)
          }));
        } else {
          console.log('[FLOW-STEP 2] No existing session found. Staying on Auth stack.');
        }
      } catch (error) {
        console.error('[FLOW-ERROR] Error restoring session:', error);
      } finally {
        setIsReady(true);
        console.log('[FLOW-STEP 3] Navigation ready.');
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
        // console.log("######################## ***** ## i am onready")
        routeNameRef.current = navigationRef.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        // console.log("######################## ***** ## i am onstatechange")
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
