import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    Dimensions,
    Platform,
    KeyboardAvoidingView
} from "react-native";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { RFValue } from "react-native-responsive-fontsize";
import {
    responsiveWidth,
    responsiveHeight,
} from "react-native-responsive-dimensions";
import SignUpButton from "../../components/common/SignUpButton";
import HeaderTextBlock from "../../components/common/HeaderTextBlock";
import Toast from "react-native-toast-message";

// Custom Checkbox Component
const CustomCheckBox = ({ value, onValueChange }) => {
    return (
        <TouchableOpacity
            style={[
                styles.customCheckbox,
                value && styles.customCheckboxChecked,
            ]}
            onPress={() => onValueChange(!value)}
        >
            {value && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
    );
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const SignInScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { isLoading, error, token } = useSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async () => {
        if (!email.trim() || !password.trim()) {
            // alert("Please enter email and password");
             Toast.show
            ({
                type: 'info',
                text1: 'Info',
                text2: 'Please enter email and password'
            });
            return;
        }

        try {
            const payload = {
                email: email.trim(),
                password: password,
                remember_me: isRememberMeChecked,
                device_id: "BE2A.250530.026.D1xx"
            };

            const resultAction = await dispatch(login(payload));

            if (!login.fulfilled.match(resultAction)) {
                const errorMessage =
                    resultAction.payload?.message ||
                    resultAction.error?.message ||
                    "Login failed";
                // alert(errorMessage);
                 Toast.show
                    ({
                        type: 'error',
                        text1: 'Error',
                        text2: `${errorMessage}`
                    });
                return;
            }
        } catch (err) {
             Toast.show
            ({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Please try again.'
            });
            // alert("Something went wrong. Please try again.");
        }
    };

    return (
        <View style={styles.outerContainer}>
            {/* Fixed Background Image Layer */}
            <View style={styles.backgroundContainer} pointerEvents="none">
                <Image
                    source={require("../../assets/images/SignInScreen.png")}
                    style={styles.bgImage}
                    resizeMode="cover"
                />
            </View>

            {/* Content Layer */}
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={0}
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
                            subtitle={'Sign in'}
                            containerStyle={{ 
                                marginLeft: responsiveWidth(9), 
                                marginTop: responsiveHeight(15) 
                            }}
                            subtitleStyle={{ 
                                fontSize: RFValue(28), 
                                fontWeight: '700' 
                            }}
                        />

                        <View style={styles.formInputFields}>
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
                        </View>

                        <View style={styles.checkBoxContainer}>
                            <View style={styles.rememberMeContainer}>
                                <CustomCheckBox
                                    value={isRememberMeChecked}
                                    onValueChange={setIsRememberMeChecked}
                                />
                                <Text style={styles.checkboxtxt}>Remember Me</Text>
                            </View>

                            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassScreen')}>
                                <Text style={styles.forgotpasswordtxt}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonSection}>
                        <SignUpButton
                            title={"Sign In"}
                            onPress={handleSignIn}
                        />
                        <View style={styles.footerTextContainer}>
                            <Text style={styles.linkText}>
                                Don't have an account?{" "}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.linkBold}>
                                    Create Account
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default SignInScreen;

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
    formInputFields: {
        marginTop: responsiveHeight(5),
        gap: responsiveHeight(2.5),
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
        height: responsiveHeight(3),
        tintColor: "white",
    },
    EyeIconSpace: {
        height: responsiveHeight(5),
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    SignInInputFields: {
        flex: 1,
        paddingLeft: 10,
        color: "white",
        fontSize: RFValue(16),
        fontWeight: "400",
    },
    checkBoxContainer: {
        marginTop: responsiveHeight(3),
        paddingHorizontal: responsiveWidth(7.5),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rememberMeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    customCheckbox: {
        width: RFValue(18),
        height: RFValue(18),
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 4,
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    customCheckboxChecked: {
        backgroundColor: "white",
    },
    checkmark: {
        color: "black",
        fontSize: RFValue(12),
        fontWeight: "bold",
    },
    checkboxtxt: {
        color: "white",
        fontSize: RFValue(12),
        fontWeight: "500",
    },
    forgotpasswordtxt: {
        color: "white",
        fontSize: RFValue(12),
        fontWeight: "500",
    },
    buttonSection: {
        alignItems: "center",
        marginTop: 'auto',
        paddingTop: responsiveHeight(5),
    },
    footerTextContainer: {
        flexDirection: 'row',
        marginTop: responsiveHeight(3),
        alignItems: 'center',
    },
    linkText: {
        color: "white",
        fontSize: RFValue(16),
    },
    linkBold: {
        fontWeight: "800",
        fontSize: RFValue(16),
        color: "white",
    },
});