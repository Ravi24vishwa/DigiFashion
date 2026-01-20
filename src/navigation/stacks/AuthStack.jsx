import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import SplashScreen from '../../screens/auth/SplashScreen';
import IntroScreen from '../../screens/auth/IntroScreen';
import PreSignInScreen from '../../screens/auth/PreSignInScreen';
import SignInScreen from '../../screens/auth/SignInScreen';
import SignUpScreen from '../../screens/auth/SignUpScreen';
import ForgotPassScreen from '../../screens/auth/ForgotPassScreen';
import SetNewPassword from '../../screens/auth/SetNewPassword';
import PassSaveSuccessScreen from '../../screens/auth/PassSaveSuccessScreen';
import EmailVerificationScreen from '../../screens/auth/EmailVerificationScreen';
const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                contentStyle: { backgroundColor: 'white' }
            }}
        >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="IntroScreen" component={IntroScreen} />
            <Stack.Screen name="PreSignInScreen" component={PreSignInScreen} />
            <Stack.Screen name="EmailVerificationScreen" component={EmailVerificationScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="ForgotPassScreen" component={ForgotPassScreen} />
            <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
            <Stack.Screen name="PassSaveSuccessScreen" component={PassSaveSuccessScreen} />

        </Stack.Navigator>
    );
};

export default AuthStack;
