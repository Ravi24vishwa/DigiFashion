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
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#5B6BEE',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      {/* Home */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              {focused && <View style={styles.activeIndicator} />}
              <View style={[
                styles.iconContainer,
                { backgroundColor: focused ? '#5B6BEE' : 'transparent' }
              ]}>
                <Image
                  source={
                    focused
                      ? require('../assets/icons/Home.png')
                      : require('../assets/icons/HomeMT.png')
                  }
                  style={styles.icon}
                />
              </View>
              {focused ? <Text style={[
                styles.label,
                { color: focused ? '#5B6BEE' : '#9CA3AF' }
              ]}>
                Home
              </Text> : null}
            </View>
          )
        }}
      />

      {/* Category */}
      <Tab.Screen
        name="CategoryTab"
        component={CategoryStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              {focused && <View style={styles.activeIndicator} />}
              <View style={[
                styles.iconContainer,
                { backgroundColor: focused ? '#5B6BEE' : 'transparent' }
              ]}>
                <Image
                  source={
                    focused
                      ? require('../assets/icons/Category.png')
                      : require('../assets/icons/Category1.png')
                  }
                  style={styles.icon}
                />
              </View>
              {focused ? <Text style={[
                styles.label,
                { color: focused ? '#5B6BEE' : '#9CA3AF' }
              ]}>
                Category
              </Text> : null}
            </View>
          )
        }}
      />

      {/* Cart */}
      <Tab.Screen
        name="CartTab"
        component={CartStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              {focused && <View style={styles.activeIndicator} />}
              <View style={[
                styles.iconContainer,
                { backgroundColor: focused ? '#5B6BEE' : 'transparent' }
              ]}>
                <Image
                  source={
                    focused
                      ? require('../assets/icons/Bag.png')
                      : require('../assets/icons/Bag1.png')
                  }
                  style={[styles.icon, { height: 22, width: 22 }]}
                />
              </View>
              {focused ? <Text style={[
                styles.label,
                { color: focused ? '#5B6BEE' : '#9CA3AF' }
              ]}>
                Cart
              </Text> : null}
            </View>
          )
        }}
      />

      {/* Order */}
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              {focused && <View style={styles.activeIndicator} />}
              <View style={[
                styles.iconContainer,
                { backgroundColor: focused ? '#5B6BEE' : 'transparent' }
              ]}>
                <Image
                  source={
                    focused
                      ? require('../assets/icons/Buy.png')
                      : require('../assets/icons/Buy1.png')
                  }
                  style={styles.icon}
                />
              </View>
              {focused ? <Text style={[
                styles.label,
                { color: focused ? '#5B6BEE' : '#9CA3AF' }
              ]}>
                Orders
              </Text> : null}
            </View>
          )
        }}
      />

      {/* Profile */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              {focused && <View style={styles.activeIndicator} />}
              <View style={[
                styles.iconContainer,
                { backgroundColor: focused ? '#5B6BEE' : 'transparent' }
              ]}>
                <Image
                  source={
                    focused
                      ? require('../assets/icons/Profile.png')
                      : require('../assets/icons/Profile1.png')
                  }
                  style={styles.icon}
                />
              </View>
              {focused ? <Text style={[
                styles.label,
                { color: focused ? '#5B6BEE' : '#9CA3AF' }
              ]}>
                Profile
              </Text> : null}
            </View>
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