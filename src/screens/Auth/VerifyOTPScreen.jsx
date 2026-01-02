import { ImageBackground, StyleSheet, Text, View, Dimensions, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { RFValue } from "react-native-responsive-fontsize";
import {
  responsiveWidth,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import GoogleAndFacebookButtonList from '../../Buttons/CustomSocialButton'
import OtpInput from '../../CommonHelper/OTPInput'
import HeaderTextBlock from '../../CommonHelper/HeaderTextBlock';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../../store/slices/authSlice';

const VerifyOTPScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { userData } = route.params || {};
  const { isLoading, token } = useSelector(state => state.auth);
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
      navigation.replace("Main");
    } else {
      const errorMessage = resultAction.payload?.message || "Verification failed";
      alert(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/SignUpOTPScreen.png')}
        style={styles.bgScreen}
        resizeMode="cover"
      />

      <KeyboardAvoidingView
        style={styles.keyboardcontainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          {/* <View style={styles.headerContainer}>
          <Text style={styles.appTitle}>
            Digi<Text style={styles.appTitleBold}>FASHION</Text>
          </Text>
          <Text style={styles.pageTitle}>Enter OTP</Text>
        </View> */}
          <HeaderTextBlock
            title="Digi"
            boldPart="FASHION"
            subtitle={'Enter OTP'}
            containerStyle={{ marginLeft: responsiveWidth(9) }}
            subtitleStyle={{ fontSize: RFValue(26), fontWeight: '700' }}
          />
          {/* OTP Input field */}
          <View style={styles.OTPContainer}>
            <OtpInput onChangeOTP={handleOtpChange} />
          </View>

          {/* verify button */}
          <View style={{ alignSelf: 'center' }}>
            <GoogleAndFacebookButtonList
              width={responsiveWidth(60)}
              height={responsiveHeight(6.5)}
              backgroundColor="#637BDD"
              title="Verify "
              textColor="#FFF"
              onPress={handleVerify}
              style={styles.verfyBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default VerifyOTPScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: Dimensions.get('screen').height,
    backgroundColor: '#000'
  },
  keyboardcontainer: {
    flex: 1,
  },
  headerContainer: {
    marginTop: responsiveHeight(22),
    marginLeft: responsiveWidth(10),
  },
  appTitle: {
    color: "white",
    fontSize: RFValue(48),
  },
  appTitleBold: {
    fontWeight: "bold"
  },
  pageTitle: {
    color: "white",
    fontSize: RFValue(29),
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 20,
  },
  OTPContainer: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 22,
    marginBottom: responsiveHeight(16),
    marginTop: responsiveHeight(4),
  },
  verfyBtn: {
    marginBottom: responsiveHeight(2)
  }
})
