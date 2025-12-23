import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';

const AddressStep = ({ addressForm, setAddressForm, onSaveAndContinue }) => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
            <TextInput
                style={styles.inputField}
                placeholder="Flat/House No/Building"
                placeholderTextColor="#999"
                value={addressForm.flatNo}
                onChangeText={(val) => setAddressForm({ ...addressForm, flatNo: val })}
            />
            <TextInput
                style={styles.inputField}
                placeholder="Landmark(Optional)"
                placeholderTextColor="#999"
                value={addressForm.landmark}
                onChangeText={(val) => setAddressForm({ ...addressForm, landmark: val })}
            />
            <TextInput
                style={styles.inputField}
                placeholder="Pincode"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={addressForm.pincode}
                onChangeText={(val) => setAddressForm({ ...addressForm, pincode: val })}
            />
            <TextInput
                style={styles.inputField}
                placeholder="State"
                placeholderTextColor="#999"
                value={addressForm.state}
                onChangeText={(val) => setAddressForm({ ...addressForm, state: val })}
            />
            <TextInput
                style={styles.inputField}
                placeholder="City"
                placeholderTextColor="#999"
                value={addressForm.city}
                onChangeText={(val) => setAddressForm({ ...addressForm, city: val })}
            />

            <View style={styles.contactHeader}>
                <Image source={require('./../../assets/icons/Call.png')} style={styles.contactIcon} />
                <Text style={styles.contactTitle}>Contact Details</Text>
            </View>

            <View style={styles.contactRow}>
                <TextInput
                    style={[styles.inputField, { flex: 1, marginRight: 10 }]}
                    placeholder="Name"
                    placeholderTextColor="#999"
                    value={addressForm.name}
                    onChangeText={(val) => setAddressForm({ ...addressForm, name: val })}
                />
                <TextInput
                    style={[styles.inputField, { flex: 1 }]}
                    placeholder="Contact Number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={addressForm.phone}
                    onChangeText={(val) => setAddressForm({ ...addressForm, phone: val })}
                />
            </View>

            <TouchableOpacity
                style={styles.bigAddAddressBtn}
                onPress={onSaveAndContinue}
            >
                <Text style={styles.bigAddAddressText}>Save Address and Continue</Text>
            </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
    </ScrollView>
);

const styles = StyleSheet.create({
    stepContent: {
        flex: 1,
        backgroundColor: '#fff',
    },
    formContainer: {
        padding: 20,
    },
    inputField: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        fontSize: 14,
        color: '#333',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    contactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    contactIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
        tintColor: '#333',
    },
    contactTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bigAddAddressBtn: {
        backgroundColor: '#637BDD',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#637BDD',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    bigAddAddressText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default AddressStep;
