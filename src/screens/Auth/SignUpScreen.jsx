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
import HeaderTextBlock from "../../components/common/HeaderTextBlock";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';
import SignUpButton from "../../components/common/SignUpButton";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

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
        if (!name || !email || !password || !otpCode || !phoneNumber) {
            alert("Please fill all fields");
            return;
        }

        const userData = { name, email, password, phone_no: phoneNumber, confirmpassword: password };
        const resultAction = await dispatch(verifyOtp({
            ...userData,
            otp: otpCode
        }));

        if (!verifyOtp.fulfilled.match(resultAction)) {
            const errorMessage = resultAction.payload?.message || "Verification failed";
            alert(errorMessage);
        }
    };

    return (
        <View style={styles.outerContainer}>
            {/* Fixed Background Image Layer */}
            <View style={styles.backgroundContainer} pointerEvents="none">
                <Image
                    source={require("../../assets/images/SignUpScreen.png")}
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
                        <View style={styles.navButtons}>
                            <TouchableOpacity
                                style={styles.navButton}
                                onPress={() => navigation.replace("EmailVerificationScreen")}
                            >
                                <Image
                                    source={require('../../assets/icons/Back.png')}
                                    style={styles.ArrowStyle}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.navButton}
                                onPress={() => navigation.replace("SignInScreen")}
                            >
                                <Text style={styles.skipText}>Skip{" "}</Text>
                                <Image
                                    source={require('../../assets/icons/Forward.png')}
                                    style={styles.ArrowStyle}
                                />
                            </TouchableOpacity>
                        </View>

                        <HeaderTextBlock
                            title="Digi"
                            boldPart="FASHION"
                            subtitle={'Create Account'}
                            containerStyle={{ marginLeft: responsiveWidth(9), marginTop: responsiveHeight(8) }}
                            subtitleStyle={{ fontSize: RFValue(26), fontWeight: '700' }}
                        />

                        <View style={styles.formInputFields}>
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
                    </View>

                    <View style={styles.buttonSection}>
                        <SignUpButton
                            title={'Sign up'}
                            onPress={handleSignUp}
                            loading={isLoading}
                        />
                        <View style={styles.footerTextContainer}>
                            <Text style={styles.LogInText}>Already Have account? </Text>
                            <TouchableOpacity onPress={() => navigation.popTo('SignInScreen')}>
                                <Text style={styles.boldTxt}>Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default SignUpScreen;

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
    navButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(5),
        marginTop: responsiveHeight(2),
    },
    navButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    ArrowStyle: {
        height: responsiveHeight(2),
        width: responsiveWidth(4),
        resizeMode: 'contain',
        tintColor: 'white'
    },
    skipText: {
        color: "white",
        fontSize: RFValue(14),
        fontWeight: "500",
    },
    formInputFields: {
        marginTop: responsiveHeight(3),
        gap: responsiveHeight(2),
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        width: responsiveWidth(85),
        alignSelf: "center",
        borderBottomWidth: 2,
        borderBottomColor: "white",
        paddingBottom: responsiveHeight(0.5),
    },
    inputIcon: {
        width: responsiveWidth(6),
        height: responsiveWidth(6),
        resizeMode: "contain",
        tintColor: "white",
    },
    passwordicon: {
        width: responsiveWidth(7),
        height: responsiveHeight(2.5),
        resizeMode: 'contain',
        tintColor: "white",
    },
    EyeIconSpace: {
        height: responsiveHeight(5),
        paddingHorizontal: 10,
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
    buttonSection: {
        alignItems: "center",
        marginTop: 'auto',
        paddingTop: responsiveHeight(5),
    },
    footerTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveHeight(2),
    },
    LogInText: {
        fontSize: RFValue(16),
        color: 'white',
    },
    boldTxt: {
        fontWeight: 'bold',
        fontSize: RFValue(16),
        color: 'white',
    },
});
