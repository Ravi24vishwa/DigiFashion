import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SuccessStep = ({ onContinueShopping }) => (
    <View style={styles.container}>
        <View style={styles.content}>
            <View style={styles.iconContainer}>
                <Image
                    source={require('./../../assets/icons/PaymentSuccess.png')}
                    style={styles.successIcon}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.title}>Success!</Text>
            <Text style={styles.subtitle}>Your order will be delivered soon.</Text>
            <Text style={styles.subtitle}>Thank you for choosing our app!</Text>
        </View>

        <TouchableOpacity
            style={styles.continueButton}
            onPress={onContinueShopping}
        >
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    content: {
        alignItems: 'center',
        marginBottom: 80,
    },
    iconContainer: {
        width: 360,
        height: 360,
        borderRadius: 80,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom: 40,
    },
    successIcon: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 35,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        lineHeight: 24,
    },
    continueButton: {
        backgroundColor: '#637BDD',
        width: width - 40,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        position: 'absolute',
        bottom: 70,
        shadowColor: '#637BDD',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
});

export default SuccessStep;
