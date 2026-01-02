import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Stacks
import HomeStackNavigator from './stacks/HomeStack';
import CategoryStackNavigator from './stacks/CategoryStack';
import CartStackNavigator from './stacks/CartStack';
import ProfileStackNavigator from './stacks/ProfileStack';

// Import screens (Only those not in stacks)
import OrderScreen from '../screens/Home/Order/OrderScreen';
import { useTabBarVisibility } from '../contexts/TabBarVisibilityContext';



const Tab = createBottomTabNavigator();

// Reusable Tab Icon Component
const TabIcon = React.memo(({ focused, activeIcon, inactiveIcon, label, iconStyle }) => (
  <View style={styles.tabItem}>
    {focused && <View style={styles.activeIndicator} />}
    <View style={[
      styles.iconContainer,
      { backgroundColor: focused ? '#5B6BEE' : 'transparent' }
    ]}>
      <Image
        source={focused ? activeIcon : inactiveIcon}
        style={[styles.icon, iconStyle]}
      />
    </View>
    {focused && (
      <Text style={[
        styles.label,
        { color: '#5B6BEE' } // Simplified color since it only renders when focused
      ]}>
        {label}
      </Text>
    )}
  </View>
));

const BottomNavigation = () => {
  const { isTabBarVisible } = useTabBarVisibility();

  return (
    <Tab.Navigator
      initialRouteName='HomeTab'
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: isTabBarVisible ? 'flex' : 'none',
          height: 65,
          paddingBottom: 10,
          paddingTop: 0,
          borderTopWidth: 0,
          elevation: 20,
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#5B6BEE',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Home"
              activeIcon={require('../assets/icons/Home.png')}
              inactiveIcon={require('../assets/icons/HomeMT.png')}
            />
          )
        }}
      />

      <Tab.Screen
        name="CategoryTab"
        component={CategoryStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Category"
              activeIcon={require('../assets/icons/Category.png')}
              inactiveIcon={require('../assets/icons/Category1.png')}
            />
          )
        }}
      />

      <Tab.Screen
        name="CartTab"
        component={CartStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Cart"
              activeIcon={require('../assets/icons/Bag.png')}
              inactiveIcon={require('../assets/icons/Bag1.png')}
              iconStyle={{ height: 22, width: 22 }}
            />
          )
        }}
      />

      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Orders"
              activeIcon={require('../assets/icons/Buy.png')}
              inactiveIcon={require('../assets/icons/Buy1.png')}
            />
          )
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Profile"
              activeIcon={require('../assets/icons/Profile.png')}
              inactiveIcon={require('../assets/icons/Profile1.png')}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 5,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  icon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
  label: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 32,
    width: 60,
    textAlign: 'center'
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 60,
    borderRadius: 2,
  },
});

export default BottomNavigation;