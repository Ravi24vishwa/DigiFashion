import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';

const AddressStep = ({
    addresses,
    states,
    selectedAddressId,
    onSelectAddress,
    addressForm,
    setAddressForm,
    onSaveAndContinue
}) => {
    const [showForm, setShowForm] = useState(addresses.length === 0);

    const renderAddressItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.addressItem,
                selectedAddressId === item.id && styles.selectedAddressItem
            ]}
            onPress={() => onSelectAddress(item.id)}
        >
            <View style={styles.addressHeader}>
                <View style={styles.addressTypeBadge}>
                    <Text style={styles.addressTypeText}>{item.address_type?.toUpperCase() || 'HOME'}</Text>
                </View>
                {selectedAddressId === item.id && (
                    <Image source={require('./../../../assets/icons/Show.png')} style={styles.checkIcon} />
                )}
            </View>
            <Text style={styles.addressName}>{item.title || 'Shipping Address'}</Text>
            <Text style={styles.addressText}>{item.address}, {item.apt}</Text>
            <Text style={styles.addressText}>{item.city}, {item.zipcode}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            {!showForm && addresses.length > 0 && (
                <View style={styles.savedSection}>
                    <Text style={styles.sectionTitle}>Saved Addresses</Text>
                    {addresses.map((item) => (
                        <View key={item.id.toString()}>
                            {renderAddressItem({ item })}
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.addNewButton}
                        onPress={() => setShowForm(true)}
                    >
                        <Text style={styles.addNewButtonText}>+ Add New Address</Text>
                    </TouchableOpacity>

                    {selectedAddressId && (
                        <TouchableOpacity
                            style={styles.bigAddAddressBtn}
                            onPress={onSaveAndContinue}
                        >
                            <Text style={styles.bigAddAddressText}>Deliver to this Address</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {(showForm || addresses.length === 0) && (
                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Add New Address</Text>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Address Title (e.g. Home, Office)"
                        placeholderTextColor="#999"
                        value={addressForm.title}
                        onChangeText={(val) => setAddressForm({ ...addressForm, title: val })}
                    />
                    <TextInput
                        style={styles.inputField}
                        placeholder="Flat/House No/Building"
                        placeholderTextColor="#999"
                        value={addressForm.flatNo}
                        onChangeText={(val) => setAddressForm({ ...addressForm, flatNo: val })}
                    />
                    <TextInput
                        style={styles.inputField}
                        placeholder="Street Address / Landmark"
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

                    {/* Placeholder for State selection list/modal */}
                    <TextInput
                        style={styles.inputField}
                        placeholder="City"
                        placeholderTextColor="#999"
                        value={addressForm.city}
                        onChangeText={(val) => setAddressForm({ ...addressForm, city: val })}
                    />

                    <View style={styles.contactHeader}>
                        <Image source={require('./../../../assets/icons/Call.png')} style={styles.contactIcon} />
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

                    <View style={styles.formActions}>
                        <TouchableOpacity
                            style={styles.bigAddAddressBtn}
                            onPress={onSaveAndContinue}
                        >
                            <Text style={styles.bigAddAddressText}>Save Address and Continue</Text>
                        </TouchableOpacity>

                        {addresses.length > 0 && (
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowForm(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    stepContent: {
        flex: 1,
        backgroundColor: '#fff',
    },
    savedSection: {
        padding: 20,
    },
    formContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 20,
    },
    addressItem: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedAddressItem: {
        borderColor: '#637BDD',
        backgroundColor: '#EEF2FF',
        borderWidth: 2,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addressTypeBadge: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    addressTypeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#4B5563',
    },
    checkIcon: {
        width: 20,
        height: 20,
        tintColor: '#637BDD',
    },
    addressName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    addNewButton: {
        paddingVertical: 12,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#637BDD',
        borderRadius: 12,
        marginBottom: 20,
    },
    addNewButtonText: {
        color: '#637BDD',
        fontSize: 14,
        fontWeight: '600',
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
    formActions: {
        marginTop: 10,
    },
    cancelButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#9CA3AF',
        fontWeight: '600',
    },
});

export default AddressStep;
