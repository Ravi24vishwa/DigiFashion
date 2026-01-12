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
import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";
// import GoogleAndFacebookButtonList from "../../components/common/CustomSocialButton";
import HeaderTextBlock from "../../components/common/HeaderTextBlock";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';
import SignUpButton from "../../components/common/SignUpButton";

const SignUpScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { email: initialEmail } = route.params || {};
    const { isLoading, receivedOtp } = useSelector(state => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState(initialEmail || "");
    const [password, setPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");

    React.useEffect(() => {
        if (receivedOtp) {
            setOtpCode(receivedOtp.toString());
            Toast.show({
                type: 'success',
                text1: 'Done',
                text2: `OTP ${receivedOtp} received successfully`,
            });
        }
    }, [receivedOtp]);

    const handleSignUp = async () => {
        data = {
            name1: name,
            email1: email,
            password1: password,
            otpCode1: otpCode,
            phoneNumber1: phoneNumber
        }
        console.log('-------------------> data ', data)

        if (!name || !email || !password || !otpCode || !phoneNumber) {
            alert("Please fill all fields");
            return;
        }

        const userData = { name, email, password, phone_no: phoneNumber, confirmpassword: password };
        const resultAction = await dispatch(verifyOtp({
            ...userData,
            otp: otpCode
        }));

        if (verifyOtp.fulfilled.match(resultAction)) {
            // Navigation to 'Main' is handled automatically by MainNavigation when token is set

        } else {
            const errorMessage = resultAction.payload?.message || "Verification failed";
            alert(errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/SignUpScreen.png")}
                style={styles.bgImage}
                resizeMode="cover"
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20 }}>
                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={() => navigation.replace("EmailVerificationScreen")}
                        >
                            <Image
                                source={require('../../assets/icons/Back.png')}
                                style={styles.ArrowStyle}
                            />
                        </TouchableOpacity>
                        {/* Skip Button */}
                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={() => navigation.replace("SignInScreen")}
                        >
                            <Text style={styles.skipText}>Skip{" "}</Text>
                            <Image
                                source={require('../../assets/icons/Forward.png')}
                                style={styles.ArrowStyle}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* Header */}

                    <HeaderTextBlock
                        title="Digi"
                        boldPart="FASHION"
                        subtitle={'Create Account'}
                        containerStyle={{ marginLeft: responsiveWidth(9), marginTop: responsiveHeight(15) }}
                        subtitleStyle={{ fontSize: RFValue(26), fontWeight: '700' }}
                    />

                    {/* Input Fields */}
                    <View style={styles.formInputFields}>
                        {/* Full Name Field */}
                        <View style={styles.inputWrapper}>
                            <Image
                                source={require("../../assets/icons/User.png")}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                placeholder="Full Name"
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                style={styles.SignInInputFields}
                                keyboardType="default"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        {/* Email Field */}
                        <View style={styles.inputWrapper}>
                            <Image
                                source={require("../../assets/icons/Email.png")}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                style={styles.SignInInputFields}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        {/* PhoneNumber Field */}
                        <View style={styles.inputWrapper}>
                            <Image
                                source={require("../../assets/icons/User.png")}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                placeholder="Phone Number"
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                style={styles.SignInInputFields}
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                maxLength={10}
                            />
                        </View>

                        {/* Password Field */}
                        <View style={styles.inputWrapper}>
                            <Image
                                source={require("../../assets/icons/PasswordLock.png")}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                style={styles.SignInInputFields}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                maxLength={10}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <View style={styles.EyeIconSpace}>
                                    <Image
                                        source={
                                            showPassword
                                                ? require("../../assets/icons/Show.png")
                                                : require("../../assets/icons/Hide.png")
                                        }
                                        style={styles.passwordicon}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/* OTP Field */}
                        <View style={styles.inputWrapper}>
                            <Image
                                source={require("../../assets/icons/User.png")}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                placeholder="OTP"
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                style={styles.SignInInputFields}
                                keyboardType="number-pad"
                                value={otpCode}
                                onChangeText={setOtpCode}
                            />
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <SignUpButton
                            title={'Sign In'}
                            onPress={handleSignUp}
                            style={{ marginBottom: responsiveHeight(2) }}
                        />
                        <View style={styles.LoginTextContainer}>
                            <Text style={styles.LogInText}>Already Have account?
                                <TouchableOpacity onPress={() => navigation.popTo('SignInScreen')}>
                                    <Text style={styles.boldTxt}> Log In</Text></TouchableOpacity></Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};


export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    googleBtn: {
        marginBottom: "4%"
    },
    facebookBtn: {},

    ArrowStyle: {
        height: responsiveHeight(2),
        width: responsiveWidth(3),
        tintColor: 'white'
    },

    bgImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: Dimensions.get('screen').height,
    },

    /* Skip Button */
    skipButton: {
        top: responsiveHeight(5),
        flexDirection: "row",
        alignItems: "center",
    },
    skipText: {
        color: "white",
        fontSize: RFValue(14),
        fontWeight: "500",
    },

    /* Input Fields */
    formInputFields: {
        marginTop: 20,
        gap: 23,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        width: responsiveWidth(85),
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
    passwordicon: {
        width: responsiveWidth(7),
        height: responsiveHeight(3),
        tintColor: "white",
    },
    EyeIconSpace: {
        flex: 1,
        height: responsiveHeight(5),
        paddingHorizontal: '2%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    SignInInputFields: {
        flex: 1,
        paddingLeft: 10,
        color: "white",
        fontSize: RFValue(16),
        fontWeight: "400",
    },

    /* Buttons */
    buttonContainer: {
        alignItems: "center",
        marginTop: responsiveHeight(4),
        // backgroundColor: 'red'
    },

    linkText: {
        color: "white",
        fontSize: RFValue(19),
    },
    linkBold: {
        fontSize: RFValue(19),
        color: "white",
        fontWeight: "800",
    },
    LoginTextContainer: { alignSelf: 'center' },
    LogInText: { fontSize: RFValue(18), color: 'white' },
    boldTxt: { fontWeight: 'bold', fontSize: RFValue(18), color: 'white' },

});
