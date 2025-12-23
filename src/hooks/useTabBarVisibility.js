// hooks/useTabBarVisibility.js
import { useCallback } from 'react';

export const useTabBarVisibility = (navigation) => {
  const hideTabBar = useCallback(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' }
    });
  }, [navigation]);

  const showTabBar = useCallback(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        height: 57,
        paddingBottom: 10,
        paddingTop: 0,
        borderTopWidth: 0,
        elevation: 20,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }
    });
  }, [navigation]);

  return { hideTabBar, showTabBar };
};