import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigation, StackActions } from '@react-navigation/native'
import { RFValue } from "react-native-responsive-fontsize";
import { responsiveHeight } from "react-native-responsive-dimensions";

const SplashScreen = () => {
  const navigation = useNavigation();
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const timer = setTimeout(() => {
      // If token exists, MainNavigation will show the Main stack.
      // We don't need to manually navigate to Intro if already logged in.
      if (!token) {
        navigation.dispatch(StackActions.replace('IntroScreen'));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [token, navigation]);

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
  FirstHeadertxt: {
    color: 'black',
    fontSize: RFValue(58),
    marginVertical: responsiveHeight(4),
  },
})