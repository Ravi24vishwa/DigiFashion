import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const SizeModal = ({ visible, onClose, sizes, onSelect, selectedSize }) => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
        <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={onClose}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Size</Text>
                {sizes.map((size) => (
                    <TouchableOpacity
                        key={size}
                        style={styles.sizeOption}
                        onPress={() => onSelect(size)}
                    >
                        <Text style={[
                            styles.sizeOptionText,
                            selectedSize === size && styles.sizeOptionSelected
                        ]}>{size}</Text>
                        {selectedSize === size && <View style={styles.selectedDot} />}
                    </TouchableOpacity>
                ))}
            </View>
        </TouchableOpacity>
    </Modal>
);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        maxHeight: height * 0.6,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
        color: '#1a1a1a',
        textAlign: 'center',
    },
    sizeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sizeOptionText: {
        fontSize: 16,
        color: '#666',
    },
    sizeOptionSelected: {
        color: '#637BDD',
        fontWeight: '700',
    },
    selectedDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#637BDD',
    },
});

export default SizeModal;
