import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React from 'react'
import { RFValue } from "react-native-responsive-fontsize";
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";
import Toast from "react-native-toast-message";

const SignUpButton = (
    {
        title,
        style,
        onPress,
        imageSource = null, //require(...) OR { uri:" "}
        imageStyle,
        loading = false,
        disabled = false,
    }
) => {
    return (
        <View style={[styles.ButtonList, style]}>
            <TouchableOpacity
                style={[styles.signInBtn, (disabled || loading) && styles.disabledBtn]}
                onPress={onPress}
                disabled={disabled || loading}
            >
                {loading ? (
                    <ActivityIndicator color="#000" size="small" />
                ) : (
                    <>
                        {imageSource && (
                            <Image
                                source={imageSource}
                                style={[styles.image, imageStyle]}
                                resizeMode="contain"
                            />
                        )}
                        <Text style={styles.signInBtnTxt}>{title}</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    )
}

export default SignUpButton

const styles = StyleSheet.create({
    ButtonList: {
        // flex: 1,
        // justifyContent: 'flex-end',
        // alignItems: 'center',
    },
    signInBtn: {
        flexDirection: 'row',
        backgroundColor: 'white',
        width: responsiveWidth(80),
        height: responsiveHeight(6.5),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        // backgroundColor: 'red'
    },
    disabledBtn: {
        opacity: 0.7,
        backgroundColor: '#f0f0f0'
    },
    signInBtnTxt: {
        color: '#000',
        fontSize: RFValue(18),
        fontWeight: '500',
    },
    image: {
        height: responsiveHeight(4.9),
        width: responsiveWidth(8),
        // backgroundColor: 'powderblue',
        marginRight: 10
    }
})
