import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { miscService } from '../../../api/miscService';

export const ContactModal = ({ visible, onClose }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.message) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            await miscService.contactUs(form);
            Alert.alert('Success', 'Your message has been sent. We will get back to you soon!');
            setForm({ name: '', email: '', phone: '', subject: '', message: '' });
            onClose();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Contact Us</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name *"
                            value={form.name}
                            onChangeText={(val) => setForm({ ...form, name: val })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address *"
                            keyboardType="email-address"
                            value={form.email}
                            onChangeText={(val) => setForm({ ...form, email: val })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                            value={form.phone}
                            onChangeText={(val) => setForm({ ...form, phone: val })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Subject"
                            value={form.subject}
                            onChangeText={(val) => setForm({ ...form, subject: val })}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Message *"
                            multiline
                            numberOfLines={4}
                            value={form.message}
                            onChangeText={(val) => setForm({ ...form, message: val })}
                        />

                        <TouchableOpacity
                            style={[styles.submitButton, isLoading && styles.disabledButton]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            <Text style={styles.submitButtonText}>
                                {isLoading ? 'Sending...' : 'Send Message'}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: '85%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1a1a1a',
    },
    closeText: {
        fontSize: 24,
        color: '#9CA3AF',
        padding: 5,
    },
    formScroll: {
        flex: 1,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        marginBottom: 16,
        color: '#1a1a1a',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#637BDD',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
