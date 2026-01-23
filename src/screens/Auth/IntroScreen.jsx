import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React from 'react'
import { RFValue } from "react-native-responsive-fontsize";
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";
import HeaderTextBlock from '../../components/common/HeaderTextBlock'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const IntroScreen = ({ navigation }) => {
    return (
        <View style={styles.outerContainer}>
            {/* Fixed Background Image Layer */}
            <View style={styles.backgroundContainer} pointerEvents="none">
                <Image
                    source={require('../../assets/images/SplashCleanBackground.png')}
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
                        <View style={styles.headerSection}>
                            <HeaderTextBlock
                                title="Digi"
                                boldPart="FASHION"
                                subtitle={'Explore the new \nworld of Clothing'}
                                subtitleStyle={{ fontSize: RFValue(26) }}
                            />
                        </View>
                    </View>

                    <View style={styles.buttonSection}>
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
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default IntroScreen;

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
    headerSection: {
        width: '100%',
        alignItems: 'center',
        marginTop: responsiveHeight(12),
    },
    buttonSection: {
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: responsiveHeight(5),
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
