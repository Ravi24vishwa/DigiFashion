import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import CategoriesListScreen from '../../screens/Home/Category/CategoriesListScreen';
import CategoryProductsScreen from '../../screens/Home/Category/CategoryProductsScreen';

const CategoryStack = createNativeStackNavigator();

const CategoryStackNavigator = () => {
    return (
        <CategoryStack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
            options={{
                tabBarStyle: { display: 'none' },
            }}
        >
            <CategoryStack.Screen
                name="CategoriesList"
                component={CategoriesListScreen}
            />
            <CategoryStack.Screen
                name="CategoryProducts"
                component={CategoryProductsScreen}
            />
        </CategoryStack.Navigator>
    );
};

export default CategoryStackNavigator;
