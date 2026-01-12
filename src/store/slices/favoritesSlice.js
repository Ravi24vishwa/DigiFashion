import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/apiService';
import { API_ENDPOINTS } from '../../api/endpoints';

// export const fetchFavorites = createAsyncThunk(
//   'favorites/fetchFavorites',
//   async (_, { rejectWithValue }) => {
//     console.log('[REDUX-STEP 1] fetchFavorites thunk started');
//     try {
//       console.log('[REDUX-STEP 2] Dispatching API call for fetchFavorites...');
//       const data = await api.get(API_ENDPOINTS.FAVORITE_LIST);
//       console.log('[REDUX-STEP 3] fetchFavorites successful', data);
//       // Handle both 'Data' and 'data' for robustness
//       const items = data.Data || data.data || [];
//       return items;
//       console.log('[REDUX-STEP 1] fetchFavorites thunk started');
//       try {
//         console.log('[REDUX-STEP 2] Dispatching API call for fetchFavorites...');
//         const data = await api.get('favorite/list');
//         console.log('[REDUX-STEP 3] fetchFavorites successful', data);
//         return data.data || []; // Assuming list is in data.data
//       } catch (error) {
//         console.error('[REDUX-STEP ERROR] fetchFavorites failed:', error.message);
//         return rejectWithValue(error.data || { message: error.message });
//       }
//     }
// );
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    console.log('[REDUX-STEP 1] fetchFavorites thunk started');

    try {
      console.log('[REDUX-STEP 2] Dispatching API call for fetchFavorites...');

      const response = await api.get(API_ENDPOINTS.FAVORITE_LIST);
      console.log('[REDUX-STEP 3] fetchFavorites successful', response);

      // Handle both backend response formats safely
      const items = response?.Data || response?.data || [];

      return items;
    } catch (error) {
      console.error(
        '[REDUX-STEP ERROR] fetchFavorites failed:',
        error?.response || error?.message
      );

      return rejectWithValue(
        error?.response?.data || { message: error.message }
      );
    }
  }
);

export const toggleFavoriteAsync = createAsyncThunk(
  'favorites/toggleFavorite',
  async (productId, { dispatch, rejectWithValue }) => {
    // Normalize to Number for consistent API communication
    const normalizedId = Number(productId);
    console.log('[REDUX-STEP 1] toggleFavoriteAsync started', { normalizedId });

    try {
      console.log('[REDUX-STEP 2] Dispatching API call for toggleFavorite...');
      const response = await api.post(API_ENDPOINTS.FAVORITE_TOGGLE, { product_id: normalizedId });
      console.log('[REDUX-STEP 3] toggleFavorite successful', response);

      // [ONE WAY RESOLVE] After every successful toggle, refresh the full list 
      // from server to ensure local state (IDs + full Items) matches perfectly.
      dispatch(fetchFavorites());

      return normalizedId;
    } catch (error) {
      const errorMessage = error.message || '';

      // Handle "Duplicate entry" as a soft success (sync via refresh)
      if (errorMessage.includes('Duplicate entry') || errorMessage.includes('1062')) {
        console.warn('[REDUX-STEP INFO] Item already in favorites (Duplicate entry). Syncing via refresh.');

        // Even on duplicate, we refresh to make sure we didn't miss anything
        dispatch(fetchFavorites());

        return rejectWithValue({
          message: 'Duplicate entry',
          isDuplicate: true,
          productId: normalizedId
        });
      }

      console.error('[REDUX-STEP ERROR] toggleFavorite failed:', error.message);
      return rejectWithValue(error.data || { message: error.message });
    }
  }
);

const initialState = {
  favoriteIds: [],
  items: [],
  isLoading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favoriteIds = [];
      state.items = [];
    },
    setFavorites: (state, action) => {
      state.favoriteIds = (action.payload || []).map(Number);
    },
    // Manual removal helper for UI to call if toggle is stuck
    removeFavoriteLocally: (state, action) => {
      const productId = Number(action.payload); // NORMALIZE TO NUMBER
      state.favoriteIds = state.favoriteIds.filter(id => Number(id) !== productId);
      state.items = state.items.filter(item => Number(item.id || item.product_id) !== productId);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        // Store full objects for the wishlist screen
        state.items = action.payload || [];
        // Map objects to IDs for quick lookup - NORMALIZE TO NUMBER
        state.favoriteIds = (action.payload || []).map(item => Number(item.id || item.product_id));
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })
      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        const productId = Number(action.payload);
        const idx = state.favoriteIds.indexOf(productId);
        // Optimistic toggle (will be corrected by fetchFavorites.fulfilled soon)
        if (idx === -1) {
          state.favoriteIds.push(productId);
        } else {
          state.favoriteIds.splice(idx, 1);
          state.items = state.items.filter(item => Number(item.id || item.product_id) !== productId);
        }
      })
      .addCase(toggleFavoriteAsync.rejected, (state, action) => {
        const errorMessage = action.payload?.message || action.error?.message || '';
        const productId = Number(action.payload?.productId || action.meta?.arg);

        if (errorMessage.includes('Duplicate entry') || errorMessage.includes('1062')) {
          // If server says duplicate, it means it's definitely a favorite
          if (productId && !state.favoriteIds.includes(productId)) {
            state.favoriteIds.push(productId);
          }
        } else {
          state.error = errorMessage;
        }
      });
  },
});

export const {
  clearFavorites,
  setFavorites,
  removeFavoriteLocally,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
