import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import CartScreen from '../../screens/Home/Cart/CartScreen';

const CartStack = createNativeStackNavigator();

const CartStackNavigator = () => {
    return (
        <CartStack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
            options={{
                tabBarStyle: { display: 'none' },
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
