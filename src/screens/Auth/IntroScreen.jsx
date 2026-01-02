import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import { RFValue } from "react-native-responsive-fontsize";
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";
import HeaderTextBlock from '../../CommonHelper/HeaderTextBlock'
const { width, height } = Dimensions.get('screen');

const IntroScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/images/SplashCleanBackground.png')}
                style={styles.SplashImage}
            >
                <HeaderTextBlock
                    title="Digi"
                    boldPart="FASHION"
                    subtitle={'Explore the new \nworld of Clothing'}
                    subtitleStyle={{ fontSize: RFValue(26) }}
                />

                <TouchableOpacity
                    style={styles.exploreButton}
                    onPress={() => navigation.navigate('EmailVerificationScreen')}
                >
                    <Text style={styles.exploreText}>Let's Explore</Text>

                    <Image
                        source={require('../../assets/icons/ExploreArrow.png')}
                        style={styles.exploreIconImage}
                    />
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}

export default IntroScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    SplashImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    FirstHeader: {
        width: '80%',
        alignItems: 'flex-start',
        marginTop: responsiveHeight(23),
    },
    FirstHeadertxt: {
        color: 'white',
        fontSize: RFValue(48),
        marginVertical: responsiveHeight(2),
    },
    SecondHeardtxt: {
        color: 'white',
        fontSize: RFValue(26),
        textAlign: 'left',
    },
    exploreButton: {
        backgroundColor: 'white',
        width: responsiveWidth(75),
        height: responsiveHeight(6.5),
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20,
        flexDirection: 'row',
        paddingHorizontal: responsiveWidth(10),
        marginTop: responsiveHeight(49),
    },
    exploreText: {
        color: 'black',
        fontSize: RFValue(18),
        fontWeight: 'bold'
    },
    exploreIconImage: {
        height: responsiveHeight(3.5),
        width: responsiveWidth(7),
        resizeMode: 'contain'
    }
});
