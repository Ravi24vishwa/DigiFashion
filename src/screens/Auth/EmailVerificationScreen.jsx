import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions
} from "react-native";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

//helping packages
import { RFValue } from "react-native-responsive-fontsize";
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";
import Toast from 'react-native-toast-message';

//helping components
// import GoogleAndFacebookButtonList from "../../components/common/CustomSocialButton";
import HeaderTextBlock from "../../components/common/HeaderTextBlock";
import { googleLogin, sendOtp } from "../../store/slices/authSlice";
import SignUpButton from '../../components/common/SignUpButton';



const EmailVerificationScreen = ({ navigation }) => {
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '612975934664-agpmvj7u3hgdpbd9r97gt4o31h7o0q1u.apps.googleusercontent.com',
            offlineAccess: true,
        });
    }, [])


    const dispatch = useDispatch();
    const { isLoading } = useSelector(state => state.auth);
    const [localLoading, setLocalLoading] = useState(false);
    const [email, setEmail] = useState("");
    // const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateEmail = (value) => {
        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[c,o,m]{2,}$/;

        if (!value) {
            return 'Email is required';
        }
        if (!emailRegex.test(value)) {
            return 'Enter a valid email address';
        }
        return '';
    };
    //google login configuration
    async function onGoogleButtonPress() {
        try {
            setLocalLoading(true);
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const signInResult = await GoogleSignin.signIn();

            let idToken = signInResult.data?.idToken || signInResult.idToken;
            console.log('ID Token:', idToken, 'Sign In Result:', signInResult);
            if (!idToken) {
                setLocalLoading(false);
                throw new Error('Google Sign-In failed: No ID token found');
            }

            const googleCredential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(getAuth(), googleCredential);
            setLocalLoading(false);
            return userCredential;
        } catch (error) {
            setLocalLoading(false);
            console.error('onGoogleButtonPress Error:', error);
            Alert.alert('Google Login Error', error.message);
            throw error;
        }
    }

    const handleSendOtp = async () => {
        if (!email) {
            // alert("Please enter email");
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please Enter Email id',
            });
            return;
        }
        const error = validateEmail(email);
        if (error) {
            Toast.show({
                type: 'error',
                text1: 'Done',
                text2: error,
            });
            setEmailError(error);
            return;
        }
        setEmailError('');
        const resultAction = await dispatch(sendOtp(email));
        console.log('API', resultAction);


        if (sendOtp.fulfilled.match(resultAction)) {
            navigation.navigate('SignUpScreen', { email });
        } else {
            const errorMessage = resultAction.payload?.message || "Failed to send OTP";
            Alert.alert('Error', errorMessage);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const res = await onGoogleButtonPress();
            if (res && res.user) {
                console.log('Signed in with Google Firebase!', res.user.email);

                // Prepare payload for backend API
                const payload = {
                    email: res.user.email,
                    google_id: res.user.uid,
                    name: res.user.displayName,
                    profile_pic: res.user.photoURL
                };

                console.log("------------------Dispatching googleLogin with payload:", payload);
                const resultAction = await dispatch(googleLogin(payload));

                if (googleLogin.fulfilled.match(resultAction)) {
                    console.log('Backend Google Login Successful');
                    // No need to navigate manually, MainNavigation will redirect 
                    // because state.auth.token is now set.
                } else {
                    const errorMsg = resultAction.payload?.message || "Backend login failed";
                    Alert.alert("Login Error", errorMsg);
                }
            }
        } catch (error) {
            console.log('handleGoogleLogin Error: ', error);
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/EmailVerification.png")}
                style={styles.bgImage}
                resizeMode="cover"
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.BackArrowBtnContainer}>
                        <TouchableOpacity
                            style={styles.BackButton}
                            onPress={() => navigation.pop()}
                        >
                            {/* <Image
                                    source={require('../../assets/icons/Back.png')}
                                    style={styles.ArrowStyle}
                                /> */}
                        </TouchableOpacity>
                    </View>

                    {/* Header */}
                    <HeaderTextBlock
                        title="Digi"
                        boldPart="FASHION"
                        subtitle={'Email Verification'}
                        containerStyle={{ marginLeft: responsiveWidth(9), marginBottom: responsiveHeight(6) }}
                        subtitleStyle={{ fontSize: RFValue(26), fontWeight: '700' }}
                    />
                    {/* Input Fields */}
                    <View style={styles.formInputFields}>
                        <View style={styles.DiscriptionTxt}>
                            <Text style={{ color: 'white', fontSize: RFValue(16) }}>Please Verify your Email Id</Text>
                        </View>
                        {/* Email Field */}
                        <View style={styles.inputWrapper}>
                            <Image
                                source={require("../../assets/icons/Email.png")}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                placeholder="Enter Email Id"
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                style={styles.inputField}
                                keyboardType="email-address"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setEmailError(validateEmail(text));
                                }}
                                autoCapitalize="none"
                                onBlur={() => setEmailError(validateEmail(email))}
                            />
                            {emailError ? (
                                <Text style={styles.errorText}>{emailError}</Text>
                            ) : null}
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <SignUpButton
                            title={'Sign Up'}
                            onPress={handleSendOtp}
                        />
                        <SignUpButton
                            title={'Google Login'}
                            onPress={handleGoogleLogin}
                            imageSource={require('../../assets/icons/google.png')}
                        />
                    </View>
                    <GoogleAndFacebookButtonList
                        width={responsiveWidth(70)}
                        height={responsiveHeight(6.5)}
                        backgroundColor="white"
                        title={localLoading ? "Logging in..." : "Log in with Google"}
                        textColor="#000"
                        icon={require('../../assets/icons/google.png')}
                        onPress={handleGoogleLogin}
                        style={[styles.googleBtn, { alignSelf: 'center' }]} // keeps your variable name exactly same
                    />
                    <View style={styles.LoginTextContainer}>
                        <Text style={styles.LogInText}>Already Have account?
                            <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                                <Text style={styles.boldTxt}> Log In</Text></TouchableOpacity></Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View >
    );
}

export default EmailVerificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    googleBtn: {
        marginTop: responsiveHeight(2)
    },
    bgImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: Dimensions.get('screen').height,
    },

    BackArrowBtnContainer: {
        top: responsiveHeight(5),
        flexDirection: 'row',
        marginHorizontal: 20,
        height: responsiveHeight(2),
    },

    BackButton: {
        flexDirection: "row",
        alignItems: "center",
    },

    ArrowStyle: {
        height: 26,
        width: 26,
        tintColor: 'white'
    },
    /* Input Fields */
    formInputFields: {
        marginTop: 20,
        gap: 23,
    },

    DiscriptionTxt: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        width: responsiveWidth(82),
        // backgroundColor: 'red'
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        width: responsiveWidth(82),
        alignSelf: "center",
        borderBottomWidth: 2,
        borderBottomColor: "white",
        paddingBottom: responsiveHeight(0.2),
    },

    inputIcon: {
        width: responsiveWidth(6),
        height: responsiveWidth(6),
        resizeMode: "contain",
        tintColor: "white",
    },

    inputField: {
        flex: 1,
        paddingLeft: 10,
        color: "white",
        fontSize: RFValue(16),
        fontWeight: "400",
    },

    /* Buttons */
    buttonContainer: {
        alignItems: "center",
        marginTop: responsiveHeight(10),
        gap: 15
    },
    errorText: {
        color: '#c91717ff',
        fontSize: RFValue(12),
        marginTop: responsiveHeight(1),
        marginLeft: responsiveWidth(2),
    },
    errorText: {
        color: '#c91717ff',
        fontSize: RFValue(12),
        marginTop: responsiveHeight(1),
        marginLeft: responsiveWidth(2),
    },

    sendButton: {
        marginBottom: "2%",
    },
    LoginTextContainer: { alignSelf: 'center', marginTop: responsiveHeight(2.8) },
    LogInText: { fontSize: RFValue(18), color: 'white' },
    boldTxt: { fontWeight: 'bold', fontSize: RFValue(18), color: 'white' },
});
