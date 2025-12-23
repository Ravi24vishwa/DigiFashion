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
import GoogleAndFacebookButtonList from "../Buttons/CustomSocialButton";
import HeaderTextBlock from "../CommonHelper/HeaderTextBlock";

const SignUpScreen = ({ navigation }) => {
    const [ShowPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = () => {
        if (!name || !email || !password) {
            alert("Please fill all fields");
            return;
        }
        // Proceed to sign up logic
        navigation.navigate("SignInScreen");
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/images/SignUpScreen.png")}
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
                            onPress={() => navigation.replace("SignInScreen")}
                        >
                            <Image
                                source={require('../assets/icons/Back.png')}
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
                                source={require('../assets/icons/Forward.png')}
                                style={styles.ArrowStyle}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* Header */}

                    <HeaderTextBlock
                        title="Digi"
                        boldPart="FASHION"
                        subtitle={'Create Account'}
                        containerStyle={{ marginLeft: responsiveWidth(9) }}
                        subtitleStyle={{ fontSize: RFValue(26), fontWeight: '700' }}
                    />

                    {/* Input Fields */}
                    <View style={styles.formInputFields}>
                        {/* Email Field */}
                        <View style={styles.inputWrapper}>
                            <Image
                                source={require("../assets/icons/User.png")}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                placeholder="Name"
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                style={styles.SignInInputFields}
                                keyboardType="default"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
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

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <GoogleAndFacebookButtonList
                            width={responsiveWidth(80)}
                            height={responsiveHeight(6.5)}
                            backgroundColor="white"
                            title="Sign Up"
                            textColor="#000"
                            icon={require('../assets/icons/email1.png')}
                            onPress={handleSignUp}
                            style={styles.googleBtn}
                        />
                        <GoogleAndFacebookButtonList
                            width={responsiveWidth(80)}
                            height={responsiveHeight(6.5)}
                            backgroundColor="white"
                            title="Log in with Google"
                            textColor="#000"
                            icon={require('../assets/icons/google.png')}
                            onPress={() => console.log("Google Sign In")}
                            style={styles.googleBtn} // keeps your variable name exactly same
                        />

                        <GoogleAndFacebookButtonList
                            width={responsiveWidth(80)}
                            height={responsiveHeight(6.5)}
                            backgroundColor="#4267B2"
                            title="Log in With Facebook"
                            textColor="white"
                            icon={require('../assets/icons/facebook.png')}
                            onPress={() => console.log("Facebook Sign In")}
                            style={styles.facebookBtn} // keeps your variable name EXACTLY same
                        />
                        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(5) }}>
                            <Text style={styles.linkText}>
                                Already a account?{" "}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("SignInScreen")}
                            >
                                <Text style={styles.linkBold}>
                                    Log in
                                </Text>
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
        width: responsiveWidth(3)
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
});
