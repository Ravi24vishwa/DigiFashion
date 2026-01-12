import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/index';

const DEFAULT_DEVICE_ID = 'BE2A.250530.026.D1xx';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('cart/listing');
      return response.Data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, shopId = 1, qty = 1, deviceId = DEFAULT_DEVICE_ID, color, size }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('cart/add', {
        product_id: productId,
        shop_id: shopId,
        qty: qty,
        device_id: deviceId,
        color: color,
        size: size
      });
      dispatch(fetchCart());
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, { dispatch, rejectWithValue }) => {
    try {
      await api.post('cart/delete', { cart_item_id: cartItemId });
      dispatch(fetchCart());
      return cartItemId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, shopId = 1, qty, deviceId = DEFAULT_DEVICE_ID, color, size }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('cart/add', {
        product_id: productId,
        shop_id: shopId,
        qty: qty,
        device_id: deviceId,
        color: color,
        size: size
      });
      dispatch(fetchCart());
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
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
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch cart';
      })
      .addCase(addToCartAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add to cart';
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
