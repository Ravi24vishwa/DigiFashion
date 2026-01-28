import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SignUpButton from '../../components/common/SignUpButton';
import {
  responsiveWidth,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { RFValue } from "react-native-responsive-fontsize";

const PassSaveSuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/icons/Successmark.png')}
          style={styles.successIcon}
        />
        <Text style={styles.successTitle}>Save Successfully</Text>
        <Text style={styles.successSubtitle}>
          Your password has been changed {"\n"} successfully.
        </Text>
        <View style={styles.buttonContainer}>
          <SignUpButton
            title={'Sign In'}
            onPress={() => navigation.navigate('SignInScreen')}
          />
        </View>
      </View>
    </View>
  )
}

export default PassSaveSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(10),
  },
  successTitle: {
    fontWeight: '600',
    fontSize: RFValue(28),
    color: 'black',
    marginBottom: responsiveHeight(1),
    marginTop: responsiveHeight(4),
    textAlign: 'center',
  },
  successSubtitle: {
    textAlign: 'center',
    fontSize: RFValue(16),
    color: '#666',
    marginBottom: responsiveHeight(4),
  },
  buttonContainer: {
    marginTop: responsiveHeight(2),
  },
  successIcon: {
    height: responsiveHeight(10),
    width: responsiveWidth(20),
    resizeMode: 'contain',
  }
})