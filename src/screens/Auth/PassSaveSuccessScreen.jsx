import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SignUpButton from '../../components/common/SignUpButton';
import {
  responsiveWidth,
  responsiveHeight,
} from "react-native-responsive-dimensions";

const PassSaveSuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../../assets/icons/Successmark.png')}
          style={styles.successIcon}
        />
        <Text style={{ fontWeight: '600', fontSize: 35, color: 'black', marginBottom: responsiveHeight(1), marginTop: responsiveHeight(5) }}>Save Successfully</Text>
        <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: responsiveHeight(6) }}>Your password has been changed {"\n"}  successfully.</Text>
        <View style={{ marginTop: responsiveHeight(6.5) }}>
           <SignUpButton
                title={'Sign In'}
                onPress={() => navigation.navigate('SignIn')}
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