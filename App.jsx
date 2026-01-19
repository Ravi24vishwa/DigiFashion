
// App.js
import { StatusBar, Text } from 'react-native';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import MainNavigation from './src/navigation/MainNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/store';
import {
  CartProvider,
  FavoritesProvider,
  DataProvider,
  TabBarVisibilityProvider
} from './src/context';

import Toast from 'react-native-toast-message';

// Enable native screen support (but disable for certain navigators if needed)
enableScreens(false); // Disable native screens to avoid the prop type mismatch

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <ReduxProvider store={store}>
        <CartProvider>
          <FavoritesProvider>
            <DataProvider>
              <TabBarVisibilityProvider>
                <BottomSheetModalProvider>
                  <MainNavigation />
                  <Toast />
                </BottomSheetModalProvider>
              </TabBarVisibilityProvider>
            </DataProvider>
          </FavoritesProvider>
        </CartProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
};

export default App;

// import ReactTest from '../DigiFashion/src/screens/auth/ReactTest';

// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const App = () => {
//   return (
//     <View>
//       <ReactTest />
//     </View>
//   )
// }

// export default App

// const styles = StyleSheet.create({})