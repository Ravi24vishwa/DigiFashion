import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';

// Enable Map/Set support in Immer so slices can use Set in state safely
enableMapSet();
import cartReducer from './slices/cartSlice';
import favoritesReducer from './slices/favoritesSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    // Feature: Authentication
    auth: authReducer,

    // Feature: Shopping Cart Management
    cart: cartReducer,

    // Feature: User Favorites/Wishlist
    favorites: favoritesReducer,

    // Feature: UI State (Tab Bar Visibility, etc.)
    ui: uiReducer,
  },
});

export default store;
