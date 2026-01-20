import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../constants';
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        // console.log('[REDUX-STEP 1] login thunk started', credentials.email);
        try {
            // console.log('[REDUX-STEP 2] Dispatching API call for login...');
            const data = await api.post(API_ENDPOINTS.LOGIN, credentials);
            console.log("auth login thunk")
            // console.log('[REDUX-STEP 3] API response received. Extracting token/user...');
            const token = data.Data?.token || data.token;
            const user = data.Data?.user || data.user;

            if (token) {
                // console.log('[REDUX-STEP 4] Persisting token to AsyncStorage...');
                await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
            }
            if (user) {
                // console.log('[REDUX-STEP 5] Persisting user data to AsyncStorage...');
                await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
            }

            // console.log('[REDUX-STEP 6] Login thunk successful');
            return data;
        } catch (error) {
            // console.error('[REDUX-STEP ERROR] Login thunk failed:', error.message);
            const errorData = error.data || {};
            let message = errorData.Message || errorData.message || error.message || 'Login failed';

            if (errorData.Data && typeof errorData.Data === 'object') {
                const details = Object.values(errorData.Data).flat().join(' ');
                if (details) message = `${message}: ${details}`;
            }

            return rejectWithValue({ ...errorData, message });
        }
    }
);

export const googleLogin = createAsyncThunk(
    'auth/googleLogin',
    async (credentials, { rejectWithValue }) => {
        // console.log('[REDUX-STEP 1] googleLogin thunk started', credentials.email);
        try {
            // console.log('[REDUX-STEP 2] Dispatching API call for googleLogin...');
            const data = await api.post(API_ENDPOINTS.GOOGLE_LOGIN, credentials);

            // console.log('[REDUX-STEP 3] API response received. Extracting token/user...');
            // Robust extraction: Check for .Data wrapping first
            const token = data.Data?.token || data.token || data.access_token;
            const user = data.Data?.user || data.user;

            if (token) {
                // console.log('[REDUX-STEP 4] Persisting token to AsyncStorage...');
                await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
            } else {
                console.warn('[REDUX-WARNING] No token found in API response!');
            }

            if (user) {
                // console.log('[REDUX-STEP 5] Persisting user data to AsyncStorage...');
                await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
            }

            // console.log('[REDUX-STEP 6] Google Login thunk successful');
            return data;
        } catch (error) {
            // console.error('[REDUX-STEP ERROR] Google Login thunk failed:', error.message);
            const errorData = error.data || {};
            let message = errorData.Message || errorData.message || error.message || 'Google Login failed';

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
        // console.log('[REDUX-STEP 1] sendOtp thunk started for:', email);
        try {
            // console.log('[REDUX-STEP 2] Dispatching API call for sendOtp...');

            // Create FormData as the backend expects multipart/form-data for this endpoint
            const formData = new FormData();
            formData.append('email', email);

            const data = await api.post(API_ENDPOINTS.SEND_OTP, formData);

            // console.log('[REDUX-STEP 3] API response received for sendOtp');
            return data;
        } catch (error) {
            // console.error('[REDUX-STEP ERROR] sendOtp thunk failed:', error.message);
            const errorData = error.data || {};
            let message = errorData.Message || errorData.message || error.message || 'Failed to send OTP';

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
        // console.log('[REDUX-STEP 1] verifyOtp thunk started', otpData.email);
        try {
            // console.log('[REDUX-STEP 2] Dispatching API call for verifyOtp...');

            // Create FormData as the backend expects multipart/form-data for registration/verification
            const formData = new FormData();
            Object.keys(otpData).forEach(key => {
                formData.append(key, otpData[key]);
            });

            const data = await api.post(API_ENDPOINTS.VERIFY_OTP, formData);

            // console.log('[REDUX-STEP 3] API response received. Extracting token/user...');
            const token = data.Data?.token || data.token;
            const user = data.Data?.user || data.user;

            if (token) {
                // console.log('[REDUX-STEP 4] Persisting token to AsyncStorage...');
                await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
                await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
            }

            // console.log('[REDUX-STEP 5] verifyOtp thunk successful');
            return data;
        } catch (error) {
            // console.error('[REDUX-STEP ERROR] verifyOtp thunk failed:', error.message);
            const errorData = error.data || {};
            let message = errorData.Message || errorData.message || error.message || 'Verification failed';

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
            // Google Login
            .addCase(googleLogin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.Data?.token || action.payload.token;
                state.user = action.payload.Data?.user || action.payload.user;
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.Message || action.payload?.message || 'Google Login failed';
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
