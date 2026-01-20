import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import CartScreen from '../../screens/home/CartScreen';

const CartStack = createNativeStackNavigator();

const CartStackNavigator = () => {
    return (
        <CartStack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <CartStack.Screen
                name="Cart"
                component={CartScreen}
            />
        </CartStack.Navigator>
    );
};

export default CartStackNavigator;
