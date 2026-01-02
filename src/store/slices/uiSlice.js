import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isTabBarVisible: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTabBarVisible: (state, action) => {
      state.isTabBarVisible = action.payload;
    },
  },
});

export const { setTabBarVisible } = uiSlice.actions;

export default uiSlice.reducer;
