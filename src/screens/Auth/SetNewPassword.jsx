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
import Toast from "react-native-toast-message";
import { RFValue } from "react-native-responsive-fontsize";
import {
    responsiveWidth,
    responsiveHeight,
} from "react-native-responsive-dimensions";
import SignUpButton from '../../components/common/SignUpButton';
import HeaderTextBlock from "../../components/common/HeaderTextBlock";
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const SetNewPassword = ({ navigation, route }) => {
    const { email } = route.params || {};
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSavePassword = () => {
        if (!password.trim() || !confirmPassword.trim()) {
            // alert("Please enter both passwords");
             Toast.show
                        ({
                            type: 'error',
                            text1: 'Error',
                            text2: 'Please enter both passwords'
                        });
            return;
        }
        if (password !== confirmPassword) {
            // alert("Passwords do not match");
             Toast.show
            ({
                type: 'error',
                text1: 'Error',
                text2: 'Passwords do not match'
            });
            return;
        }
        // alert("Password saved successfully");
         Toast.show
            ({
                type: 'success',
                text1: 'Success',
                text2: 'Password saved successfully'
            });
        navigation.navigate('SignInScreen');
    }
    return (
        <View style={styles.outerContainer}>
            {/* Fixed Background Image Layer */}
            <View style={styles.backgroundContainer} pointerEvents="none">
                <Image
                    source={require("../../assets/images/SetNewPasswordScreen.png")}
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
                                onPress={() => navigation.pop()}
                            >
                                <Image
                                    source={require('../../assets/icons/Back.png')}
                                    style={styles.ArrowStyle}
                                />
                            </TouchableOpacity>
                        </View>

                        <HeaderTextBlock
                            title="Digi"
                            boldPart="FASHION"
                            subtitle={'Set New Password'}
                            containerStyle={{ marginLeft: responsiveWidth(9), marginTop: responsiveHeight(5) }}
                            subtitleStyle={{ fontSize: RFValue(32), fontWeight: '700' }}
                        />

                        <View style={styles.formInputFields}>
                            <View style={styles.inputWrapper}>
                                <Image
                                    source={require("../../assets/icons/PasswordLock.png")}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    placeholder="Enter New Password"
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    style={styles.SignInInputFields}
                                    keyboardType="visible-password"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                            <View style={styles.inputWrapper}>
                                <Image
                                    source={require("../../assets/icons/PasswordLock.png")}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    placeholder="Confirm Password"
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    style={styles.SignInInputFields}
                                    keyboardType="visible-password"
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.buttonSection}>
                        <SignUpButton
                            title={'Save'}
                            onPress={handleSavePassword}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default SetNewPassword;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#000'
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
        paddingHorizontal: responsiveWidth(5),
        marginTop: responsiveHeight(2),
    },
    navButton: {
        padding: 10,
    },
    ArrowStyle: {
        height: responsiveHeight(2),
        width: responsiveWidth(4),
        resizeMode: 'contain',
        tintColor: 'white'
    },
    formInputFields: {
        marginTop: responsiveHeight(5),
        gap: responsiveHeight(2.5),
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        width: responsiveWidth(82),
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
});

