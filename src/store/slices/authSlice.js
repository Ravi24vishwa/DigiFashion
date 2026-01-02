import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../constants';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await api.post(API_ENDPOINTS.LOGIN, credentials);
            const token = data.Data?.token || data.token;
            const user = data.Data?.user || data.user;

            if (token) await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
            if (user) await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

            return data;
        } catch (error) {
            const errorData = error.data || {};
            let message = errorData.Message || errorData.message || error.message || 'Login failed';

            // Extract detailed validation errors if available
            if (errorData.Data && typeof errorData.Data === 'object') {
                const details = Object.values(errorData.Data).flat().join(' ');
                if (details) message = `${message}: ${details}`;
            }

            return rejectWithValue({ ...errorData, message });
        }
    }
);

export const sendOtp = createAsyncThunk(
    'auth/sendOtp',
    async (email, { rejectWithValue }) => {
        try {
            const data = await api.post(API_ENDPOINTS.SEND_OTP, { email });
            console.log('[Auth] Send OTP Response:', data);
            return data;
        } catch (error) {
            const errorData = error.data || {};
            let message = errorData.Message || errorData.message || error.message || 'Failed to send OTP';

            // Extract detailed validation errors if available
            if (errorData.Data && typeof errorData.Data === 'object') {
                const details = Object.values(errorData.Data).flat().join(' ');
                if (details) message = `${message}: ${details}`;
            }

            return rejectWithValue({ ...errorData, message });
        }
    }
);

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (otpData, { rejectWithValue }) => {
        try {
            // Send as JSON instead of FormData
            const data = await api.post(API_ENDPOINTS.VERIFY_OTP, otpData);
            const token = data.Data?.token || data.token;
            const user = data.Data?.user || data.user;

            if (token) {
                await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
                await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
            }
            return data;
        } catch (error) {
            const errorData = error.data || {};
            let message = errorData.Message || errorData.message || error.message || 'Verification failed';

            // Extract detailed validation errors if available
            if (errorData.Data && typeof errorData.Data === 'object') {
                const details = Object.values(errorData.Data).flat().join(' ');
                if (details) message = `${message}: ${details}`;
            }

            return rejectWithValue({ ...errorData, message });
        }
    }
);

const initialState = {
    token: null,
    user: null,
    isLoading: false,
    error: null,
    otpSent: false,
    receivedOtp: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.otpSent = false;
            state.receivedOtp = null;
            AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
            AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
        },
        restoreToken: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.Data?.token || action.payload.token;
                state.user = action.payload.Data?.user || action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.Message || action.payload?.message || 'Login failed';
            })
            // Send OTP
            .addCase(sendOtp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.otpSent = false;
                state.receivedOtp = null;
            })
            .addCase(sendOtp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.otpSent = true;

                const payload = action.payload;
                // Unified OTP extraction logic
                state.receivedOtp =
                    payload?.otp ||
                    payload?.OTP ||
                    payload?.data?.otp ||
                    payload?.Data?.otp ||
                    payload?.otp_code ||
                    payload?.data?.OTP ||
                    payload?.Data?.OTP ||
                    null;

                if (state.receivedOtp) {
                    console.log('[Auth] OTP received:', state.receivedOtp);
                }
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.Message || action.payload?.message || 'Failed to send OTP';
            })
            // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.Data?.token || action.payload.token;
                state.user = action.payload.Data?.user || action.payload.user;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.Message || action.payload?.message || 'OTP verification failed';
            });
    },
});

export const { logout, restoreToken, clearError } = authSlice.actions;
export default authSlice.reducer;
