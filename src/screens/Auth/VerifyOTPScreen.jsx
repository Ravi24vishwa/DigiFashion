import { ImageBackground, StyleSheet, Text, View, Dimensions, KeyboardAvoidingView, ScrollView, Platform, Image } from 'react-native'
import React, { useState } from 'react'
import { RFValue } from "react-native-responsive-fontsize";
import {
  responsiveWidth,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import OtpInput from '../../components/common/OTPInput'
import HeaderTextBlock from '../../components/common/HeaderTextBlock';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../../store/slices/authSlice';
import SignUpButton from '../../components/common/SignUpButton';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const VerifyOTPScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { userData } = route.params || {};
  const { isLoading } = useSelector(state => state.auth);
  const [submittedOtp, setSubmittedOtp] = useState("");

  const handleOtpChange = (otp) => {
    setSubmittedOtp(otp);
  };

  const handleVerify = async () => {
    if (submittedOtp.length < 6) {
      alert("Please Enter OTP");
      return;
    }

    const resultAction = await dispatch(verifyOtp({
      ...userData,
      otp: submittedOtp
    }));

    if (verifyOtp.fulfilled.match(resultAction)) {
      navigation.replace("MainNavigation");
    } else {
      const errorMessage = resultAction.payload?.message || "Verification failed";
      alert(errorMessage);
    }
  };

  return (
    <View style={styles.outerContainer}>
      {/* Fixed Background Image Layer */}
      <View style={styles.backgroundContainer} pointerEvents="none">
        <Image
          source={require('../../assets/images/SignUpOTPScreen.png')}
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
              subtitle={'Enter OTP'}
              containerStyle={{ marginLeft: responsiveWidth(9), marginTop: responsiveHeight(15) }}
              subtitleStyle={{ fontSize: RFValue(26), fontWeight: '700' }}
            />
            <View style={styles.otpSection}>
              <OtpInput onChangeOTP={handleOtpChange} />
            </View>
          </View>

          <View style={styles.buttonSection}>
            <SignUpButton
              title="Verify"
              onPress={handleVerify}
              loading={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default VerifyOTPScreen;

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
  otpSection: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(8),
  },
  buttonSection: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: responsiveHeight(5),
  },
});
