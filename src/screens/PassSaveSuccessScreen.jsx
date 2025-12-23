import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import GoogleAndFacebookButtonList from '../Buttons/CustomSocialButton'
import {
  responsiveWidth,
  responsiveHeight,
} from "react-native-responsive-dimensions";

const PassSaveSuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../assets/icons/Successmark.png')}
          style={styles.successIcon}
        />
        <Text style={{ fontWeight: '600', fontSize: 35, color: 'black', marginBottom: responsiveHeight(1), marginTop: responsiveHeight(5) }}>Save Successfully</Text>
        <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: responsiveHeight(6) }}>Your password has been changed {"\n"}  successfully.</Text>
        <View style={{ marginTop: responsiveHeight(6.5) }}>
          <GoogleAndFacebookButtonList
            width={responsiveWidth(80)}
            height={responsiveHeight(6.5)}
            backgroundColor="#637BDD"
            title="Back to Login"
            textColor="white"
            onPress={() => navigation.navigate('SignInScreen')}
          // style={{backgroundColor: 'yellow'}}
          />
        </View>
      </View>
    </View>
  )
}

export default PassSaveSuccessScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  successIcon: {
    height: '10.2%',
    width: '21%',
    backgroundColor: 'white',
  }
})