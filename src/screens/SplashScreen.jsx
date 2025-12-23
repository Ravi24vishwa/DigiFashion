import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, StackActions } from '@react-navigation/native'
import { RFValue } from "react-native-responsive-fontsize";
import { responsiveHeight } from "react-native-responsive-dimensions";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch(StackActions.replace('IntroScreen'))
    }, 2000);
  })

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.FirstHeadertxt}>
        Digi<Text style={{ fontWeight: 'bold' }}>FASHION</Text>
      </Text>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  FirstHeadertxt:{
     color: 'black',
        fontSize: RFValue(58),
        marginVertical: responsiveHeight(4),
  },
})