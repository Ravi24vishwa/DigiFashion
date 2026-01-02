import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { RFValue } from "react-native-responsive-fontsize";
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";
import GoogleAndFacebookButtonList from '../../Buttons/CustomSocialButton';
import SignUpButton from '../../Buttons/SignUpButton';
import { useNavigation } from '@react-navigation/native';
import HeaderTextBlock from '../../CommonHelper/HeaderTextBlock';
const PreSignInScreen = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/PreSignInPage.png')}
        style={styles.PreSignUpImage}
      >
        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.navigate('SignInScreen')}
        >
          <Text style={styles.skipTxt}>Skip</Text>
          <Image
            source={require('../../assets/icons/Forward.png')}
          />
        </TouchableOpacity>

        {/* Header Section */}
        <HeaderTextBlock
          title="Digi"
          boldPart="FASHION"
          subtitle={'Sign up NOW \nGet 30% Cashback \non first purchase'}
          containerStyle={{ marginLeft: responsiveWidth(13) }}
          subtitleStyle={{ fontSize: RFValue(26), fontWeight: '700' }}
        />
        <View style={styles.buttonContainer}>
          <GoogleAndFacebookButtonList
            width={responsiveWidth(80)}
            height={responsiveHeight(6.5)}
            backgroundColor="white"
            title="Sign In"
            textColor="#000"
            onPress={() => navigation.navigate('SignInScreen')}
            style={styles.googleBtn} // keeps your variable name exactly same
          />
          <GoogleAndFacebookButtonList
            width={responsiveWidth(80)}
            height={responsiveHeight(6.5)}
            backgroundColor="white"
            title="Log in with Google"
            textColor="#000"
            icon={require('../../assets/icons/google.png')}
            onPress={() => console.log("Google Sign In")}
            style={styles.googleBtn} // keeps your variable name exactly same
          />
          {/* <GoogleAndFacebookButtonList
            width={responsiveWidth(80)}
            height={responsiveHeight(6.5)}
            backgroundColor="#4267B2"
            title="Log in With Facebook"
            textColor="white"
            icon={require('../../assets/icons/facebook.png')}
            onPress={() => console.log("Facebook Sign In")}
            style={styles.googleBtn} // keeps your variable name EXACTLY same
          /> */}
        </View>
      </ImageBackground>
    </View>
  )
}

export default PreSignInScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  PreSignUpImage: {
    height: '100%',
    width: '100%',
  },
  skipBtn: {
    position: 'absolute',
    top: responsiveHeight(5),
    right: responsiveWidth(5),
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  skipTxt: {
    color: 'white',
    fontSize: RFValue(14),
    fontWeight: '500',
  },
  skipArrow: {
    color: 'white',
    fontSize: RFValue(18),
    marginLeft: 2,
    fontWeight: 'bold',
  },
  FirstHeader: {
    width: '80%',
    alignItems: 'flex-start',
    marginTop: responsiveHeight(20),
    marginLeft: responsiveWidth(10)
    // backgroundColor: 'red',
  },
  FirstHeadertxt: {
    color: 'white',
    fontSize: RFValue(48),
    marginVertical: responsiveHeight(4),
  },
  SecondHeardtxt: {
    color: 'white',
    fontSize: RFValue(26),
    textAlign: 'left',
  },
  buttonContainer: {
    // backgroundColor: 'red',
    marginTop: responsiveHeight(5)
  },
  googleBtn: {
    marginTop: "4%",
    marginBottom: "4%",
    marginLeft: "10%"
  },
})