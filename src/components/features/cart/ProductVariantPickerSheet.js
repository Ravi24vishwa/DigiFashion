import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

export const ProductVariantPickerSheet = ({
  bottomSheetRef,
  snapPoints = ['65%'],
  product,
  onClose,
  setIsTabBarVisible,
  onColorSizeChange,
}) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  /* =======================
     🔧 API NORMALIZATION
     (NO UI CHANGE)
  ======================== */

  const sizes = useMemo(() => {
    if (product?.size_variants?.length > 0) {
      return product.size_variants.map(s => s.name || s);
    }
    if (product?.product_additional_details?.Size) {
      return [product.product_additional_details.Size];
    }
    return [];
  }, [product]);

  const colors = useMemo(() => {
    if (product?.color_variants?.length > 0) {
      return product.color_variants.map(c => ({
        label: c.name,
        colorCode: c.code || '#4F46E5',
      }));
    }
    if (product?.product_additional_details?.Color) {
      return [{
        label: product.product_additional_details.Color,
        colorCode: '#4F46E5',
      }];
    }
    return [];
  }, [product]);

  /* =======================
     DEFAULT SELECTIONS
  ======================== */

  useEffect(() => {
    if (!product) return;

    if (sizes.length > 0) setSelectedSize(sizes[0]);
    if (colors.length > 0) setSelectedColor(colors[0].label);

    // console.log('ProductVariantPickerSheet - normalized:', {
    //   sizes,
    //   colors,
    // });
  }, [product, sizes, colors]);

  /* =======================
     BOTTOM SHEET HANDLERS
  ======================== */

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleSheetChanges = useCallback(
    index => {
      if (index === -1) {
        setIsTabBarVisible?.(true);
        onClose?.();
      }
    },
    [setIsTabBarVisible, onClose]
  );

  const handleApply = () => {
    onColorSizeChange?.({
      color: selectedColor,
      size: selectedSize,
    });

    // onAddToCart?.({
    //   ...product, // UI expects this
    //   selected_color_name: selectedColor,
    //   selected_size_name: selectedSize,
    // });

    bottomSheetRef.current?.close();
  };

  /* =======================
     UI (UNCHANGED)
  ======================== */

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
              source={
                product?.image
                  ? typeof product.image === 'string'
                    ? { uri: product.image }
                    : product.image
                  : require('../../../assets/icons/Show.png')
              }
              style={styles.productImage}
            />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {product?.title || product?.product_name || 'Product Details'}
            </Text>
            <Text style={styles.productPrice}>
              ₹{product?.price || product?.product_price || '0.00'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Color Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Select Color:{' '}
            <Text style={styles.selectedOption}>{selectedColor}</Text>
          </Text>

          <View style={styles.optionsRow}>
            {colors.map((color, index) => {
              const label = color.label;
              const code = color.colorCode;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedColor(label)}
                  style={styles.colorOption}
                >
                  <View
                    style={[
                      styles.colorPreview,
                      { backgroundColor: code },
                    ]}
                  >
                    {selectedColor === label && (
                      <View style={styles.checkMark} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      selectedColor === label &&
                        styles.activeOptionLabel,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Size Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Select Size:{' '}
            <Text style={styles.selectedOption}>{selectedSize}</Text>
          </Text>

          <View style={styles.optionsRow}>
            {sizes.map((size, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedSize(size)}
                style={[
                  styles.sizeOption,
                  selectedSize === size &&
                    styles.selectedSizeOption,
                ]}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size &&
                      styles.selectedSizeText,
                  ]}
                >
                  {size}
                </Text>
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
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>
              Confirm Selection
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

// export default ProductVariantPickerSheet;

const styles = StyleSheet.create({
    bottomSheetBackground: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    handleIndicator: {
        backgroundColor: '#E5E7EB',
        width: 60,
        height: 5,
        borderRadius: 3,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    productSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    imageContainer: {
        width: 90,
        height: 100,
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
        marginRight: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
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
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 6,
    },
    productPrice: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 24,
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    selectedOption: {
        color: '#4F46E5',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colorOption: {
        alignItems: 'center',
        width: 75,
    },
    colorPreview: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: 'transparent',
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    selectedColorOption: {
        // Handled via border in colorPreview
    },
    checkMark: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#4F46E5',
    },
    optionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        textAlign: 'center',
    },
    activeOptionLabel: {
        color: '#1F2937',
        fontWeight: '700',
    },
    sizeOption: {
        minWidth: 55,
        height: 44,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    selectedSizeOption: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    sizeText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
    },
    selectedSizeText: {
        color: '#FFFFFF',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
        marginBottom: 30,
        gap: 16,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6B7280',
    },
    applyButton: {
        flex: 2,
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: '#4F46E5',
        alignItems: 'center',
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default ProductVariantPickerSheet;
