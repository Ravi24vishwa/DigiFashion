import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react'
import { RFValue } from "react-native-responsive-fontsize";
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";
import { useNavigation } from '@react-navigation/native';


const SignUpButton = (
    {
        title,
        style,
        onPress
    }
) => {
    const navigation = useNavigation()
    return (
        <View style={[styles.ButtonList, style]}>
            {/* Sign In Button */}
            <TouchableOpacity
                style={styles.signInBtn}
                onPress={onPress}
            >
                <Text style={styles.signInBtnTxt}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SignUpButton

const styles = StyleSheet.create({
    ButtonList: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    signInBtn: {
        backgroundColor: 'white',
        width: responsiveWidth(80),
        height: responsiveHeight(6.5),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        // backgroundColor: 'red'
    },
    signInBtnTxt: {
        color: '#000',
        fontSize: RFValue(18),
        fontWeight: '500',
    },
})