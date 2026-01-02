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
const SetNewPassword = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/SetNewPasswordScreen.png")}
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
                            style={styles.skipButton}
                            // onPress={() => navigation.navigate("VerifyOTPScreen")}
                            onPress={() => console.log('navigate to new pass screen')}
                        >
                            <Image
                                source={require('../../assets/icons/Back.png')}
                                style={styles.ArrowStyle}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Header */}

                    <HeaderTextBlock
                        title="Digi"
                        boldPart="FASHION"
                        subtitle={'Set New Password'}
                        containerStyle={{ marginLeft: responsiveWidth(9), marginBottom: responsiveHeight(4) }}
                        subtitleStyle={{ fontSize: RFValue(32), fontWeight: '700' }}
                    />

                    {/* Input Fields */}
                    <View style={styles.formInputFields}>
                        {/* Email Field */}
                        <View style={styles.inputWrapper}>
                            <Image
                                source={require("../../assets/icons/PasswordLock.png")}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                placeholder="Enter New Password"
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                style={styles.SignInInputFields}
                                keyboardType="email-address"
                            />
                        </View>
                        {/* Email Field */}
                        <View style={styles.inputWrapper}>
                            <Image
                                source={require("../../assets/icons/PasswordLock.png")}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                placeholder="Confirm Password"
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                style={styles.SignInInputFields}
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <GoogleAndFacebookButtonList
                            width={responsiveWidth(70)}
                            height={responsiveHeight(6.5)}
                            backgroundColor="#637BDD"
                            title="Save Password"
                            textColor="#FFF"
                            onPress={() => navigation.navigate('PassSaveSuccessScreen')}
                            style={styles.SendBtn}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};


export default SetNewPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },

    bgImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        height: Dimensions.get('screen').height,
    },

    BackArrowBtnContainer: {
        top: responsiveHeight(5),
        flexDirection: 'row',
        marginHorizontal: 20,
        height: responsiveHeight(2),
    },

    skipButton: {
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
        marginTop: 30,
        gap: 23,
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        width: responsiveWidth(74),
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
        marginTop: responsiveHeight(12),
    },

    SendBtn: {
        marginBottom: "4%",
        fontWeight: '600'
    },
});

