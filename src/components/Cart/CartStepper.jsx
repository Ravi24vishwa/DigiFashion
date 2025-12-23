import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CartStepper = ({ currentStep }) => (
    <View style={styles.stepsWrapper}>
        <View style={styles.stepsContainer}>
            {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                    <View style={styles.stepItem}>
                        <View
                            style={[
                                styles.stepCircle,
                                currentStep === step && styles.stepActive,
                                currentStep > step && styles.stepCompleted,
                            ]}
                        >
                            {currentStep > step ? (
                                <View style={styles.checkCircle}>
                                    <Text style={styles.checkMarkText}>✓</Text>
                                </View>
                            ) : (
                                <Text style={[
                                    styles.stepNumber,
                                    currentStep === step && styles.stepNumberActive
                                ]}>
                                    {step}
                                </Text>
                            )}
                        </View>
                        <Text style={[
                            styles.stepLabel,
                            currentStep === step && styles.stepLabelActive
                        ]}>
                            {step === 1 ? 'Cart' : step === 2 ? 'Address' : 'Payment'}
                        </Text>
                    </View>
                    {step < 3 && (
                        <View style={[
                            styles.stepConnector,
                            currentStep > step && styles.stepConnectorActive
                        ]} />
                    )}
                </React.Fragment>
            ))}
        </View>
    </View>
);

const styles = StyleSheet.create({
    stepsWrapper: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    stepsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    stepItem: {
        alignItems: 'center',
        zIndex: 2,
    },
    stepCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    stepActive: {
        borderColor: '#637BDD',
    },
    stepCompleted: {
        borderColor: '#637BDD',
        backgroundColor: '#637BDD',
    },
    checkCircle: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        backgroundColor: '#637BDD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkMarkText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    stepNumber: {
        fontSize: 12,
        color: '#999',
        fontWeight: '600',
    },
    stepNumberActive: {
        color: '#637BDD',
    },
    stepLabel: {
        fontSize: 10,
        color: '#999',
    },
    stepLabelActive: {
        color: '#333',
        fontWeight: '600',
    },
    stepConnector: {
        flex: 1,
        height: 2,
        backgroundColor: '#eee',
        position: 'relative',
        top: -8,
        marginHorizontal: -10,
    },
    stepConnectorActive: {
        backgroundColor: '#637BDD',
    },
});

export default CartStepper;
