import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

export const ProductVariantPickerSheet = ({
    bottomSheetRef,
    snapPoints = ['65%'],
    product,
    onAddToCart,
    onClose,
    setIsTabBarVisible,
    onColorSizeChange
}) => {
    const [selectedSize, setSelectedSize] = useState(product?.size[0]);
    const [selectedColor, setSelectedColor] = useState(product?.color[0]);

    const sizes = product?.size;
    // Mock colors matching the image
    const colors = [
        { label: 'Yellow', image: require('../../assets/images/Onboarding1.png'), colorCode: '#F5D020' }, // Using mockup images or colors
        { label: 'Dark Red', image: require('../../assets/images/Onboarding1.png'), colorCode: '#B91C1C' },
        { label: 'Grey', image: require('../../assets/images/Onboarding1.png'), colorCode: '#9CA3AF' },
    ];
    // Note: Using placeholder images for color preview if actual images aren't available per color. 
    // Ideally 'product' would have variants.

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            if (setIsTabBarVisible) setIsTabBarVisible(true);
            if (onClose) onClose();
        }
    }, [setIsTabBarVisible, onClose]);

    const handleApply = () => {
        // Call parent callback to update state in ProductDetailScreen
        if (onColorSizeChange) {
            onColorSizeChange({ color: selectedColor, size: selectedSize });
        }

        if (onAddToCart) {
            onAddToCart({ ...product, size: selectedSize, color: selectedColor });
        }
        bottomSheetRef.current?.close();
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
            onChange={handleSheetChanges}
        >
            <BottomSheetView style={styles.contentContainer}>
                {/* Product Summary */}
                <View style={styles.productSummary}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={product?.image ? product.image : require('../../assets/icons/Show.png')}
                            style={styles.productImage}
                        />
                    </View>
                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>{product?.name || 'Product Name'}</Text>
                        <Text style={styles.productPrice}>₹{product?.price || '0.00'}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Color Selector */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Color: <Text style={styles.selectedOption}>{selectedColor}</Text>
                    </Text>
                    <View style={styles.optionsRow}>
                        {colors.map((color) => (
                            <TouchableOpacity
                                key={color.label}
                                onPress={() => setSelectedColor(color.label)}
                                style={[
                                    styles.colorOption,
                                    selectedColor === color.label && styles.selectedColorOption
                                ]}
                            >
                                {/* Simulate color image/preview */}
                                <View style={[styles.colorPreview, { backgroundColor: color.colorCode }]}>
                                    {/* If we had specific images for colors, image would go here */}
                                </View>
                                <Text style={styles.optionLabel}>{color.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Size Selector */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Size: <Text style={styles.selectedOption}>{selectedSize}</Text>
                    </Text>
                    <View style={styles.optionsRow}>
                        {sizes.map((size) => (
                            <TouchableOpacity
                                key={size}
                                onPress={() => setSelectedSize(size)}
                                style={[
                                    styles.sizeOption,
                                    selectedSize === size && styles.selectedSizeOption
                                ]}
                            >
                                <Text style={[
                                    styles.sizeText,
                                    selectedSize === size && styles.selectedSizeText
                                ]}>{size}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => bottomSheetRef.current?.close()}
                    >
                        <Text style={styles.cancelButtonText}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={handleApply}
                    >
                        <Text style={styles.applyButtonText}>APPLY</Text>
                    </TouchableOpacity>
                </View>

            </BottomSheetView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    bottomSheetBackground: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    handleIndicator: {
        backgroundColor: '#E5E7EB',
        width: 40,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    productSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        marginRight: 16,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
    },
    selectedOption: {
        color: '#637BDD',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colorOption: {
        alignItems: 'center',
        width: 70,
    },
    selectedColorOption: {
        // Optional highlight styling
    },
    colorPreview: {
        width: 60,
        height: 60,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 4,
    },
    optionLabel: {
        fontSize: 12,
        color: '#4B5563',
        textAlign: 'center',
    },
    sizeOption: {
        width: 50,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedSizeOption: {
        backgroundColor: '#637BDD',
        borderColor: '#637BDD',
    },
    sizeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    selectedSizeText: {
        color: '#FFFFFF',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
        marginBottom: 20,
        gap: 16,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: '#637BDD',
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
