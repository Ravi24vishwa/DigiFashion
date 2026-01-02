import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import SplashScreen from '../../screens/Auth/SplashScreen';
import IntroScreen from '../../screens/Auth/IntroScreen';
import PreSignInScreen from '../../screens/Auth/PreSignInScreen';
import SignInScreen from '../../screens/Auth/SignInScreen';
import SignUpScreen from '../../screens/Auth/SignUpScreen';
import ForgotPassScreen from '../../screens/Auth/ForgotPassScreen';
import SetNewPassword from '../../screens/Auth/SetNewPassword';
import PassSaveSuccessScreen from '../../screens/Auth/PassSaveSuccessScreen';
import EmailVerificationScreen from '../../screens/Auth/EmailVerificationScreen';
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
