

// App.js
import { StyleSheet, View, StatusBar } from 'react-native';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import MainNavigation from './src/navigation/MainNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import store from './src/store';
import { DataProvider } from './src/contexts/DataContext';
import { TabBarVisibilityProvider } from './src/contexts/TabBarVisibilityContext';
import { CartProvider } from './src/contexts/CartContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';

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