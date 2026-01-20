import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from '../../screens/home/HomeScreen';
import ViewAllScreen from '../../screens/home/ViewAllScreen';

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                detachPreviousScreen: false,
            }}
        >
            <HomeStack.Screen
                name="Home"
                component={HomeScreen}
            />
            <HomeStack.Screen
                name="ViewAll"
                component={ViewAllScreen}
            />
        </HomeStack.Navigator>
    );
};

export default HomeStackNavigator;
