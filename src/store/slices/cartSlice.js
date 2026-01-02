import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/apiService';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('cart/listing');
      return data.data || []; // Adjust based on actual API response structure
    } catch (error) {
      return rejectWithValue(error.data || { message: error.message });
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, shopId = 1, qty = 1, deviceId = 'default_device' }, { rejectWithValue }) => {
    try {
      const data = await api.post('cart/add', {
        product_id: productId,
        shop_id: shopId,
        qty: qty,
        device_id: deviceId
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.data || { message: error.message });
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, { rejectWithValue }) => {
    try {
      await api.post('cart/delete', { cart_item_id: cartItemId });
      return cartItemId;
    } catch (error) {
      return rejectWithValue(error.data || { message: error.message });
    }
  }
);

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload; // Assuming payload is the list of items
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        // You might want to re-fetch the cart or update locally
        // For simplicity, let's assume we re-fetch or the API returns the new item
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => (item.cart_item_id || item.id) !== action.payload);
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
