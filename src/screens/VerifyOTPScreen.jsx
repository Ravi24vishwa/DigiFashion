import { ImageBackground, StyleSheet, Text, View, Dimensions, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { RFValue } from "react-native-responsive-fontsize";
import {
  responsiveWidth,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import GoogleAndFacebookButtonList from '../Buttons/CustomSocialButton'
import OtpInput from '../CommonHelper/OTPInput'
import HeaderTextBlock from '../CommonHelper/HeaderTextBlock';
const VerifyOTPScreen = ({ navigation }) => {
  const [Submittedotp, setSubmittedotp] = useState("")

  const handleotp = (otp) => {
    setSubmittedotp(otp)
  }

  const handleVerify = () => {
    if (Submittedotp.length !== 4) {
      alert("Please Enter OTP")
      return;
    }
    navigation.navigate('SetNewPassword')
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/OTPScreen.png')}
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
            <OtpInput onChangeOTP={handleotp} />
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
