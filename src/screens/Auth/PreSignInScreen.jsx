import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React from 'react'
import { RFValue } from "react-native-responsive-fontsize";
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";
import SignUpButton from '../../components/common/SignUpButton';
import { useNavigation } from '@react-navigation/native';
import HeaderTextBlock from '../../components/common/HeaderTextBlock';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const PreSignInScreen = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.outerContainer}>
      {/* Fixed Background Image Layer */}
      <View style={styles.backgroundContainer} pointerEvents="none">
        <Image
          source={require('../../assets/images/PreSignInPage.png')}
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
            {/* Top Section with Skip */}
            <View style={styles.skipSection}>
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => navigation.navigate('SignInScreen')}
              >
                <Text style={styles.skipTxt}>Skip</Text>
                <Image
                  source={require('../../assets/icons/Forward.png')}
                  style={styles.skipIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Middle Section with Header */}
            <View style={styles.middleSection}>
              <HeaderTextBlock
                title="Digi"
                boldPart="FASHION"
                subtitle={'Sign up NOW \nGet 30% Cashback \non first purchase'}
                containerStyle={{ marginLeft: responsiveWidth(5) }}
                subtitleStyle={{ fontSize: RFValue(24), fontWeight: '700' }}
              />
            </View>
          </View>

          {/* Bottom Section with Button */}
          <View style={styles.buttonSection}>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default PreSignInScreen

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
  skipSection: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: responsiveWidth(5),
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  buttonSection: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: responsiveHeight(5),
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },
  skipTxt: {
    color: 'white',
    fontSize: RFValue(14),
    fontWeight: '500',
    marginRight: 5,
  },
  skipIcon: {
    width: responsiveWidth(4),
    height: responsiveWidth(4),
    resizeMode: 'contain',
    tintColor: 'white',
  },
})