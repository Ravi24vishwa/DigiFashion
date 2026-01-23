import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';

const AddressStep = ({
    addresses,
    selectedAddressId,
    onSelectAddress,
    addressForm,
    setAddressForm,
    onSaveAddress,
    onContinueToPayment
}) => {
    const [showForm, setShowForm] = useState(addresses.length === 0);
    const [IsAddressSelected, setIsAddressSelected] = useState(false)
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (addresses.length > 0) {
            setShowForm(false);
        } else {
            setShowForm(true);
        }
    }, [addresses.length]);

    const validateForm = () => {
        let newErrors = {};
        // if (!addressForm.title.trim()) newErrors.title = 'Title is required';
        if (!addressForm.address_line_1.trim()) newErrors.address_line_1 = 'Flat/HouseNo/Building is required';
        if (!addressForm.address_line_2.trim()) newErrors.address_line_2 = 'Street Address  is required';
        if (!addressForm.city.trim()) newErrors.city = 'City is required';
        if (!addressForm.state.trim()) newErrors.state = 'State is required';
        if (!addressForm.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(addressForm.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
        if (!addressForm.name.trim()) newErrors.name = 'Name is required';
        if (!addressForm.phone_no.trim()) newErrors.phone_no = 'Phone number is required';
        else if (!/^\d{10}$/.test(addressForm.phone_no)) newErrors.phone_no = 'Phone number must be 10 digits';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEdit = (item) => {
        setAddressForm({
            id: item.id,
            // title: item.title || '',
            address_type: item.address_type || 'home',
            address_line_2: item.address_line_2 || '',
            address_line_1: item.address_line_1 || '',
            city: item.city || '',
            state: item.state || '',
            pincode: item.pincode || '',
            name: item.name || '',
            phone_no: item.phone_no || '',
            default: item.default || 0
        });
        setErrors({});
        setShowForm(true);
    };

    const handleAddNew = () => {
        setAddressForm({
            id: null,
            // title: '',
            address_type: 'home',
            address_line_2: '',
            address_line_1: '',
            city: '',
            state: '',
            pincode: '',
            name: '',
            phone_no: '',
            default: 0
        });
        setErrors({});
        setShowForm(true);
    };

    const onSaveInternal = async () => {
        if (!validateForm()) return;
        const success = await onSaveAddress();
        if (success) {
            setShowForm(false);
        }
    };

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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Image
                        source={
                            selectedAddressId === item.id
                                ? require('./../../../assets/icons/Selected.png')
                                : require('./../../../assets/icons/UnSelected.png')
                        }
                        style={styles.checkIcon}
                    />
                    <TouchableOpacity onPress={() => handleEdit(item)}>
                        <Image source={require('./../../../assets/icons/edit.png')} style={styles.checkIcon} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.addressName}>{item.title || 'Shipping Address'}</Text>
            <Text style={styles.addressText}>{item.address_line_2}{item.address_line_1 ? `, ${item.address_line_1}` : ''}</Text>
            <Text style={styles.addressText}>{item.city}, {item.pincode}</Text>
            <Text style={styles.addressText}>{item.name} | {item.phone_no}</Text>
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
                        onPress={handleAddNew}
                    >
                        <Text style={styles.addNewButtonText}>+ Add New Address</Text>
                    </TouchableOpacity>

                    {selectedAddressId && (
                        <TouchableOpacity
                            style={styles.bigAddAddressBtn}
                            onPress={onContinueToPayment}
                        >
                            <Text style={styles.bigAddAddressText}>Deliver to this Address</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            {(showForm || addresses.length === 0) && (
                <View style={styles.formContainer}>
                    {/* <Text style={styles.sectionTitle}>{addressForm.id ? 'Edit Address' : 'Add New Address'}</Text>
                    <TextInput
                        style={[styles.inputField, errors.title && styles.errorInput]}
                        placeholder="Address Title (e.g. Home, Office)"
                        placeholderTextColor="#999"
                        value={addressForm.title}
                        onChangeText={(val) => setAddressForm({ ...addressForm, title: val })}
                    /> */}
                    {/* {errors.title && <Text style={styles.errorText}>{errors.title}</Text>} */}
                    <View style={styles.typeContainer}>
                        {['home', 'office', 'other'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.typeButton,
                                    addressForm.address_type === type && styles.selectedTypeButton
                                ]}
                                onPress={() => setAddressForm({ ...addressForm, address_type: type })}
                            >
                                <Text style={[
                                    styles.typeButtonText,
                                    addressForm.address_type === type && styles.selectedTypeButtonText
                                ]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput
                        style={[styles.inputField, errors.address_line_1 && styles.errorInput]}
                        placeholder="Flat/House No/Building"
                        placeholderTextColor="#999"
                        value={addressForm.address_line_1}
                        onChangeText={(val) => setAddressForm({ ...addressForm, address_line_1: val })}
                    />
                    {errors.address_line_1 && <Text style={styles.errorText}>{errors.address_line_1}</Text>}
                    <TextInput
                        style={[styles.inputField, errors.address_line_2 && styles.errorInput]}
                        placeholder="Street Address / Landmark"
                        placeholderTextColor="#999"
                        value={addressForm.address_line_2}
                        onChangeText={(val) => setAddressForm({ ...addressForm, address_line_2: val })}
                    />
                    {errors.address_line_2 && <Text style={styles.errorText}>{errors.address_line_2}</Text>}
                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <TextInput
                                style={[styles.inputField, errors.city && styles.errorInput]}
                                placeholder="City"
                                placeholderTextColor="#999"
                                value={addressForm.city}
                                onChangeText={(val) => setAddressForm({ ...addressForm, city: val })}
                            />
                            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                style={[styles.inputField, errors.pincode && styles.errorInput]}
                                placeholder="Pincode"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                maxLength={6}
                                value={addressForm.pincode}
                                onChangeText={(val) => setAddressForm({ ...addressForm, pincode: val })}
                            />
                            {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
                        </View>
                    </View>
                    <TextInput
                        style={[styles.inputField, errors.state && styles.errorInput]}
                        placeholder="State"
                        placeholderTextColor="#999"
                        value={addressForm.state}
                        onChangeText={(val) => setAddressForm({ ...addressForm, state: val })}
                    />
                    {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}

                    <View style={styles.contactHeader}>
                        <Image source={require('./../../../assets/icons/Call.png')} style={styles.contactIcon} />
                        <Text style={styles.contactTitle}>Contact Details</Text>
                    </View>

                    <View style={styles.contactRow}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <TextInput
                                style={[styles.inputField, errors.name && styles.errorInput]}
                                placeholder="Name"
                                placeholderTextColor="#999"
                                value={addressForm.name}
                                onChangeText={(val) => setAddressForm({ ...addressForm, name: val })}
                            />
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                style={[styles.inputField, errors.phone_no && styles.errorInput]}
                                placeholder="Contact Number"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={addressForm.phone_no}
                                onChangeText={(val) => setAddressForm({ ...addressForm, phone_no: val })}
                            />
                            {errors.phone_no && <Text style={styles.errorText}>{errors.phone_no}</Text>}
                        </View>
                    </View>

                    <View style={styles.formActions}>
                        <TouchableOpacity
                            style={styles.bigAddAddressBtn}
                            onPress={onSaveInternal}
                        >
                            <Text style={styles.bigAddAddressText}>Save Address</Text>
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
        // backgroundColor: 'red'
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
        height: 21,
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
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    selectedTypeButton: {
        borderColor: '#637BDD',
        backgroundColor: '#EEF2FF',
    },
    typeButtonText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '600',
    },
    selectedTypeButtonText: {
        color: '#637BDD',
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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    errorInput: {
        borderColor: 'red',
    },
});

export default AddressStep;
