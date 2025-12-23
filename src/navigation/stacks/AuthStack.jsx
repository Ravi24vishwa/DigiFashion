import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import SplashScreen from '../../screens/SplashScreen';
import IntroScreen from '../../screens/IntroScreen';
import PreSignInScreen from '../../screens/PreSignInScreen';
import SignInScreen from '../../screens/SignInScreen';
import SignUpScreen from '../../screens/SignUpScreen';
import ForgotPassScreen from '../../screens/ForgotPassScreen';
import SetNewPassword from '../../screens/SetNewPassword';
import VerifyOTPScreen from '../../screens/VerifyOTPScreen';
import PassSaveSuccessScreen from '../../screens/PassSaveSuccessScreen';

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
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassScreen" component={ForgotPassScreen} />
            <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} />
            <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
            <Stack.Screen name="PassSaveSuccessScreen" component={PassSaveSuccessScreen} />
        </Stack.Navigator>
    );
};

export default AuthStack;
