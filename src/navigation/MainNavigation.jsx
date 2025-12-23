import React, { useRef } from "react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: 'white' }
        }}
      >
        {/* Auth Stack */}
        <Stack.Screen name="Auth" component={AuthStack} />

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

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
