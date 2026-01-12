import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const HeaderTextBlock = ({ title, boldPart, subtitle, subtitleStyle, containerStyle }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.title}>
                {title}
                <Text style={styles.bold}>{boldPart}</Text>
            </Text>

            <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
        </View>
    );
};

export default HeaderTextBlock;

const styles = StyleSheet.create({
    container: {
        width: '80%',
        alignItems: 'flex-start',
        marginTop: responsiveHeight(20),
    },
    title: {
        color: 'white',
        fontSize: RFValue(48),
        marginVertical: responsiveHeight(2),
    },
    bold: {
        fontWeight: 'bold',
    },
    subtitle: {
        color: 'white',
        textAlign: 'left',
    },
});
