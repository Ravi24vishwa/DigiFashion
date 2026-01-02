import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/apiService';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('favorite/list');
      return data.data || []; // Assuming list is in data.data
    } catch (error) {
      return rejectWithValue(error.data || { message: error.message });
    }
  }
);

export const toggleFavoriteAsync = createAsyncThunk(
  'favorites/toggleFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      await api.post('favorite', { product_id: productId });
      return productId;
    } catch (error) {
      return rejectWithValue(error.data || { message: error.message });
    }
  }
);

const initialState = {
  favoriteIds: [],
  isLoading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favoriteIds = [];
    },
    setFavorites: (state, action) => {
      state.favoriteIds = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        // Map objects to IDs if necessary, or store full objects
        state.favoriteIds = action.payload.map(item => item.id || item.product_id);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })
      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        const productId = action.payload;
        const idx = state.favoriteIds.indexOf(productId);
        if (idx === -1) {
          state.favoriteIds.push(productId);
        } else {
          state.favoriteIds.splice(idx, 1);
        }
      });
  },
});

export const {
  clearFavorites,
  setFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
