// import { StyleSheet, View, StatusBar } from 'react-native';
// import React from 'react';
// import MainNavigation from './src/navigation/MainNavigation';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

// const App = () => {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} />
//       <BottomSheetModalProvider>
//         <MainNavigation />
//       </BottomSheetModalProvider>
//     </GestureHandlerRootView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({});
//========================================================================================================================================




// import { StyleSheet, View, StatusBar } from 'react-native';
// import React from 'react';
// import MainNavigation from './src/navigation/MainNavigation';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// const App = () => {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <StatusBar
//         translucent
//         backgroundColor={'transparent'}
//         barStyle={'dark-content'}
//       />
//       <MainNavigation />
//     </GestureHandlerRootView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({});


// App.js
import { StyleSheet, View, StatusBar } from 'react-native';
import React from 'react';
import MainNavigation from './src/navigation/MainNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabBarVisibilityProvider } from './src/contexts/TabBarVisibilityContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
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
      <BottomSheetModalProvider>
        <TabBarVisibilityProvider>
          <CartProvider>
            <FavoritesProvider>
              <MainNavigation />
            </FavoritesProvider>
          </CartProvider>
        </TabBarVisibilityProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;