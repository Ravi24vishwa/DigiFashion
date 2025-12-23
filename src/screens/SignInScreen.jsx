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
import {
    responsiveWidth,
    responsiveHeight,
} from "react-native-responsive-dimensions";
import SignUpButton from "../Buttons/SignUpButton";
import HeaderTextBlock from "../CommonHelper/HeaderTextBlock";
// const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

const SignInScreen = ({ navigation }) => {
    const [ShowPassword, setShowPassword] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = () => {
        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }
        // Proceed to proper navigation or auth check
        navigation.replace("Main");
    };

    return (
        <View style={styles.container}>
            {/* Fixed Background Image */}
            <ImageBackground
                source={require("../assets/images/SignInScreen.png")}
                style={styles.bgImage}
                resizeMode="cover"
            />

            {/* Scrollable Content Overlay */}
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                // style={{backgroundColor: 'red'}}
                >
                    {/* Header */}
                    <HeaderTextBlock
                        title="Digi"
                        boldPart="FASHION"
                        subtitle={'Sign in'}
                        containerStyle={{ marginLeft: responsiveWidth(9) }}
                        subtitleStyle={{ fontSize: RFValue(28), fontWeight: '700' }}
                    />

                    {/* Input Fields */}
                    <View style={styles.formInputFields}>
                        {/* Email Field */}
                        <View style={styles.inputWrapper}>
                            <Image
                                source={require("../assets/icons/Email.png")}
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

                        {/* Password Field */}
                        <View style={styles.inputWrapper}>
                            <Image
                                source={require("../assets/icons/PasswordLock.png")}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                style={styles.SignInInputFields}
                                secureTextEntry={!ShowPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!ShowPassword)}
                            >
                                <View style={styles.EyeIconSpace}>
                                    <Image
                                        source={
                                            ShowPassword
                                                ? require("../assets/icons/Show.png")
                                                : require("../assets/icons/Hide.png")
                                        }
                                        style={styles.passwordicon}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Checkbox + Forgot Password */}
                    <View style={styles.checkBoxContainer}>
                        <View style={styles.rememberMeContainer}>
                            <CustomCheckBox
                                value={isSelected}
                                onValueChange={setIsSelected}
                            />
                            <Text style={styles.checkboxtxt}>Remember Me</Text>
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassScreen')}>
                            <Text style={styles.forgotpasswordtxt}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <SignUpButton
                            title={"Sign In"}
                            style={{ marginBottom: responsiveHeight(0) }}
                            onPress={handleSignIn}
                        />
                        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(5) }}>
                            <Text style={styles.linkText}>
                                Don't have an account?{" "}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("SignUpScreen")}
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
    container: {
        flex: 1,
        backgroundColor: '#000',
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
    keyboardView: {
        flex: 1,
    },
    formInputFields: {
        marginTop: 40,
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
        marginTop: responsiveHeight(2),
        marginLeft: responsiveWidth(7),
        marginRight: responsiveWidth(7),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rememberMeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    customCheckbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 3,
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
        fontSize: 14,
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
    buttonContainer: {
        alignItems: "center",
        marginTop: responsiveHeight(14),
        marginBottom: responsiveHeight(5),
    },
    linkText: {
        color: "white",
        fontSize: RFValue(19),
    },
    linkBold: {
        fontWeight: "800",
        fontSize: RFValue(19),
        color: "white",
    },
});
