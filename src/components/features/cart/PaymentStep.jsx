import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import PriceDetails from './PriceDetails';

const PaymentStep = ({
    paymentGateways,
    selectedPayment,
    onSelectPayment,
    cartItemsCount,
    totalProductPrice
}) => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.paymentSection}>
            {paymentGateways.map((gate) => (
                <TouchableOpacity
                    key={gate.id}
                    style={[styles.paymentGatewayCard, selectedPayment === gate.id && styles.activeGatewayCard]}
                    onPress={() => onSelectPayment(gate.id)}
                >
                    <View style={styles.gatewayInfo}>
                        <View style={styles.gatewayLogoContainer}>
                            <Image source={gate.image} style={styles.gatewayLogo} resizeMode="contain" />
                        </View>
                        <Text style={[styles.gatewayName, selectedPayment === gate.id && styles.activeGatewayName]}>{gate.name}</Text>
                    </View>
                    <View style={[styles.paymentRadio, selectedPayment === gate.id && styles.paymentRadioActive]}>
                        {selectedPayment === gate.id && <View style={styles.paymentRadioInner} />}
                    </View>
                </TouchableOpacity>
            ))}

            <PriceDetails
                cartItemsCount={cartItemsCount}
                totalProductPrice={totalProductPrice}
            />
        </View>
    </ScrollView>
);

const styles = StyleSheet.create({
    stepContent: {
        flex: 1,
        backgroundColor: '#fff',
    },
    paymentSection: {
        padding: 20,
    },
    paymentGatewayCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#f0f0f0',
    },
    activeGatewayCard: {
        borderColor: '#637BDD',
        backgroundColor: '#fff',
    },
    gatewayInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gatewayLogoContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    gatewayLogo: {
        width: '70%',
        height: '70%',
    },
    gatewayName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    activeGatewayName: {
        color: '#1a1a1a',
    },
    paymentRadio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentRadioActive: {
        borderColor: '#637BDD',
    },
    paymentRadioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#637BDD',
    },
});

export default PaymentStep;
