
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ImageBackground,
    Alert,
    Dimensions
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// helpers
import { RFValue } from 'react-native-responsive-fontsize';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';

// components & redux
import HeaderTextBlock from '../../components/common/HeaderTextBlock';
import SignUpButton from '../../components/common/SignUpButton';
import { googleLogin, sendOtp } from '../../store/slices/authSlice';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');


const EmailVerificationScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const { isLoading } = useSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                '612975934664-agpmvj7u3hgdpbd9r97gt4o31h7o0q1u.apps.googleusercontent.com',
            offlineAccess: true,
        });
    }, []);

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Enter a valid email address';
        return '';
    };

    const handleSendOtp = async () => {
        const error = validateEmail(email);
        if (error) {
            setEmailError(error);
            Toast.show({ type: 'error', text1: 'Error', text2: error });
            return;
        }

        setEmailError('');
        const resultAction = await dispatch(sendOtp(email));

        if (sendOtp.fulfilled.match(resultAction)) {
            navigation.navigate('SignUpScreen', { email });
        } else {
            Alert.alert('Error', resultAction.payload?.message || 'Failed to send OTP');
        }
    };


    const onGoogleButtonPress = async () => {
        try {
            setLocalLoading(true);

            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });

            // Force account picker
            await GoogleSignin.signOut();

            const signInResult = await GoogleSignin.signIn();

            // 🚨 SAFETY CHECK
            if (!signInResult?.data?.idToken) {
                return null;
            }

            const credential = GoogleAuthProvider.credential(
                signInResult.data.idToken
            );

            return await signInWithCredential(getAuth(), credential);

        } catch (err) {

            // ✅ USER CANCELLED → STOP EVERYTHING
            if (err.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User cancelled Google login');
                return null;
            }

            // Other real errors
            Alert.alert('Google Login Error', err.message);
            throw err;

        } finally {
            setLocalLoading(false);
        }
    };


    const handleGoogleLogin = async () => {
        try {
            const res = await onGoogleButtonPress();

            // 🚨 STOP API CALL
            if (!res?.user) {
                console.log('No Google user selected → API call skipped');
                return;
            }

            const payload = {
                email: res.user.email,
                google_id: res.user.uid,
                name: res.user.displayName,
                profile_pic: res.user.photoURL,
                device_id: 'sample_device_id_12345',
            };

            const resultAction = await dispatch(googleLogin(payload));

            if (!googleLogin.fulfilled.match(resultAction)) {
                Alert.alert(
                    'Login Error',
                    resultAction.payload?.message || 'Login failed'
                );
            }
        } catch (e) {
            console.log('handleGoogleLogin error:', e);
        }
    };




    return (
        <View style={styles.outerContainer}>
            {/* Fixed Background Image Layer */}
            <View style={styles.backgroundContainer} pointerEvents="none">
                <Image
                    source={require('../../assets/images/EmailVerification.png')}
                    style={styles.bgImage}
                    resizeMode="cover"
                />
            </View>

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View style={styles.topSection}>
                        <HeaderTextBlock
                            title="Digi"
                            boldPart="FASHION"
                            subtitle="Email Verification"
                            containerStyle={{
                                marginLeft: responsiveWidth(9),
                                marginTop: responsiveHeight(10),
                            }}
                            subtitleStyle={{
                                fontSize: RFValue(26),
                                fontWeight: '700',
                            }}
                        />
                        <View style={styles.form}>
                            <Text style={styles.description}>
                                Please Verify your Email Id
                            </Text>

                            <View style={styles.inputWrapper}>
                                <Image
                                    source={require('../../assets/icons/Email.png')}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    placeholder="Enter Email Id"
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    style={styles.input}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        if (emailError) setEmailError('');
                                    }}
                                />
                            </View>

                            {emailError ? (
                                <Text style={styles.errorText}>{emailError}</Text>
                            ) : null}
                        </View>
                    </View>
                    {/* BUTTON SECTION */}
                    <View style={styles.buttonSection}>
                        <SignUpButton
                            title="Sign Up"
                            onPress={handleSendOtp}
                            loading={isLoading && !localLoading}
                        />
                        <SignUpButton
                            title="Google Login"
                            onPress={handleGoogleLogin}
                            imageSource={require('../../assets/icons/google.png')}
                            loading={localLoading || (isLoading && localLoading)}
                            style={{
                                marginTop: 10,
                            }}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already Have account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                                <Text style={styles.footerBold}>Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default EmailVerificationScreen

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    bgImage: {
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        minHeight: SCREEN_HEIGHT,
        paddingBottom: responsiveHeight(8),
    },
    topSection: {
        width: '100%',
        flex: 1,
    },
    form: {
        marginTop: responsiveHeight(4),
        alignItems: 'center',
        gap: responsiveHeight(2),
    },
    description: {
        color: '#fff',
        fontSize: RFValue(16),
        width: responsiveWidth(82),
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: responsiveWidth(82),
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
    },
    inputIcon: {
        width: responsiveWidth(6),
        height: responsiveWidth(6),
        tintColor: '#fff',
    },
    input: {
        flex: 1,
        color: '#fff',
        paddingLeft: 10,
        fontSize: RFValue(16),
    },
    buttonSection: {
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: responsiveHeight(5),
    },
    footer: {
        flexDirection: 'row',
        marginTop: responsiveHeight(2),
        alignSelf: 'center'
    },
    footerText: {
        color: '#fff',
        fontSize: RFValue(16),
    },
    footerBold: {
        color: '#fff',
        fontSize: RFValue(16),
        fontWeight: 'bold',
    },
})