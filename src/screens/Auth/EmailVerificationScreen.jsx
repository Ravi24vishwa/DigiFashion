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
import GoogleAndFacebookButtonList from "../../Buttons/CustomSocialButton";
import HeaderTextBlock from "../../CommonHelper/HeaderTextBlock";


import { useDispatch, useSelector } from "react-redux";
import { sendOtp } from "../../store/slices/authSlice";


const EmailVerificationScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector(state => state.auth);
    const [email, setEmail] = useState("");

    const handleSendOtp = async () => {
        if (!email) {
            alert("Please enter email");
            return;
        }
        const resultAction = await dispatch(sendOtp(email));
        console.log('API', resultAction);


        if (sendOtp.fulfilled.match(resultAction)) {
            navigation.navigate('SignUpScreen', { email });
        } else {
            const errorMessage = resultAction.payload?.message || "Failed to send OTP";
            alert(errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/ForgotPasswordScreen.png")}
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
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <GoogleAndFacebookButtonList
                            width={responsiveWidth(70)}
                            height={responsiveHeight(6.5)}
                            backgroundColor="#637BDD"
                            title={isLoading ? "Sending..." : "Send OTP"}
                            textColor="#FFF"
                            onPress={handleSendOtp}
                            style={styles.sendButton}
                        />
                    </View>
                    <View style={styles.LoginTextContainer}>
                        <Text style={styles.LogInText}>Already Have account?
                            <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                                <Text style={styles.boldTxt}> Log In</Text></TouchableOpacity></Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View >
    );
};


export default EmailVerificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
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
    },

    sendButton: {
        marginBottom: "2%",
    },
    LoginTextContainer: { alignSelf: 'center' },
    LogInText: { fontSize: RFValue(18), color: 'white' },
    boldTxt: { fontWeight: 'bold', fontSize: RFValue(18), color: 'white' },
});
