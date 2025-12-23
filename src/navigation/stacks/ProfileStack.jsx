import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import ProfileScreen from '../../screens/Home/Profile/ProfileScreen';
import Settings from '../../screens/Home/Profile/Settings';
import EditProfile from '../../screens/Home/Profile/EditProfile';

const ProfileStack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
    return (
        <ProfileStack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <ProfileStack.Screen
                name="ProfileHome"
                component={ProfileScreen}
            />
            <ProfileStack.Screen
                name="Settings"
                component={Settings}
            />
            <ProfileStack.Screen
                name="EditProfile"
                component={EditProfile}
            />
        </ProfileStack.Navigator>
    );
};

export default ProfileStackNavigator;
