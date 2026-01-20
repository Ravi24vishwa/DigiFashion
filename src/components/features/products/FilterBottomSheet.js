import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH * 0.55; // Adjust based on sidebar width
const THUMB_SIZE = 24;

// Custom Checkbox Component
const CustomCheckbox = ({ checked, onPress, label }) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

// Simple Range Slider Component
const PriceSlider = ({ min, max, initialLow, initialHigh, onValueChange }) => {
  const lowX = useSharedValue(0);
  const highX = useSharedValue(SLIDER_WIDTH);

  // Added React state for labels to avoid "Objects are not valid as React child" error
  const [labelLow, setLabelLow] = useState(min);
  const [labelHigh, setLabelHigh] = useState(max);

  // Sync labels when min/max change via props
  useEffect(() => {
    setLabelLow(min);
    setLabelHigh(max);
    lowX.value = 0;
    highX.value = SLIDER_WIDTH;
  }, [min, max]);

  const lowValue = useDerivedValue(() => {
    return Math.round(min + (lowX.value / SLIDER_WIDTH) * (max - min));
  });

  const highValue = useDerivedValue(() => {
    return Math.round(min + (highX.value / SLIDER_WIDTH) * (max - min));
  });

  const updateValues = () => {
    onValueChange([lowValue.value, highValue.value]);
  };

  const lowGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = lowX.value;
    },
    onActive: (event, ctx) => {
      let nextX = ctx.startX + event.translationX;
      nextX = Math.max(0, Math.min(nextX, highX.value - THUMB_SIZE));
      lowX.value = nextX;
      runOnJS(setLabelLow)(Math.round(min + (nextX / SLIDER_WIDTH) * (max - min)));
    },
    onEnd: () => {
      runOnJS(updateValues)();
    },
  });

  const highGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = highX.value;
    },
    onActive: (event, ctx) => {
      let nextX = ctx.startX + event.translationX;
      nextX = Math.max(lowX.value + THUMB_SIZE, Math.min(nextX, SLIDER_WIDTH));
      highX.value = nextX;
      runOnJS(setLabelHigh)(Math.round(min + (nextX / SLIDER_WIDTH) * (max - min)));
    },
    onEnd: () => {
      runOnJS(updateValues)();
    },
  });

  const lowThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: lowX.value - THUMB_SIZE / 2 }],
  }));

  const highThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: highX.value - THUMB_SIZE / 2 }],
  }));

  const trackStyle = useAnimatedStyle(() => ({
    left: lowX.value,
    width: highX.value - lowX.value,
  }));

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.priceLabels}>
        <Text style={styles.priceValue}>₹{labelLow}</Text>
        <Text style={styles.priceValue}>₹{labelHigh}</Text>
      </View>
      <View style={styles.trackBackground}>
        <Animated.View style={[styles.trackHighlight, trackStyle]} />
        <PanGestureHandler onGestureEvent={lowGestureHandler}>
          <Animated.View style={[styles.thumb, lowThumbStyle]} />
        </PanGestureHandler>
        <PanGestureHandler onGestureEvent={highGestureHandler}>
          <Animated.View style={[styles.thumb, highThumbStyle]} />
        </PanGestureHandler>
      </View>
    </View>
  );
};

export const FilterBottomSheet = ({
  bottomSheetRef,
  snapPoints,
  filterData,
  selectedFilters,
  onFilterChange,
  onClearAll,
  onApply,
  setIsTabBarVisible
}) => {
  const [activeSection, setActiveSection] = useState('brand');

  const filterSections = useMemo(() => [
    { key: 'price', title: 'Price Range' },
    { key: 'brand', title: 'Brand' }
  ], []);

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
      setIsTabBarVisible?.(true);
    }
  }, [setIsTabBarVisible]);

  const handleFilterToggle = (sectionKey, optionLabel) => {
    const currentFilters = selectedFilters[sectionKey] || [];
    const isSelected = currentFilters.includes(optionLabel);
    onFilterChange({
      ...selectedFilters,
      [sectionKey]: isSelected
        ? currentFilters.filter((f) => f !== optionLabel)
        : [...currentFilters, optionLabel],
    });
  };

  const handlePriceChange = (range) => {
    onFilterChange({
      ...selectedFilters,
      price_range: range
    });
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
      <View style={styles.bottomSheetContent}>
        <View style={styles.filterHeader}>
          <Text style={styles.drawerTitle}>Filters</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.sidebar}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {filterSections.map((section) => {
                const isActive = activeSection === section.key;
                const hasSelection = section.key === 'brand'
                  ? (selectedFilters.brand?.length > 0)
                  : (selectedFilters.price_range !== undefined);

                return (
                  <TouchableOpacity
                    key={section.key}
                    style={[
                      styles.sidebarItem,
                      isActive && styles.sidebarItemActive
                    ]}
                    onPress={() => setActiveSection(section.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.sidebarText,
                      isActive && styles.sidebarTextActive,
                      hasSelection && styles.sidebarTextWithBadge
                    ]}>
                      {section.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.contentArea}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {activeSection === 'brand' && filterData?.brand && (
                <View style={styles.filterSection}>
                  {filterData.brand.map((brandName, index) => (
                    <CustomCheckbox
                      key={index}
                      checked={selectedFilters.brand?.includes(brandName)}
                      onPress={() => handleFilterToggle('brand', brandName)}
                      label={brandName}
                    />
                  ))}
                </View>
              )}

              {activeSection === 'price' && filterData?.price_range && (
                <View style={styles.filterSection}>
                  <Text style={[styles.checkboxLabel, { marginBottom: 20 }]}>Price Range</Text>
                  <PriceSlider
                    min={parseFloat(filterData.price_range.min)}
                    max={parseFloat(filterData.price_range.max)}
                    onValueChange={handlePriceChange}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        </View>

        <View style={styles.filterFooter}>
          <View style={styles.footerContent}>
            <Text style={styles.productCount}>
              {filterData?.brand?.length > 0 ? `${filterData.brand.length} Brands available` : ''}
            </Text>
            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={onClearAll}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={onApply}
              >
                <Text style={styles.applyButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
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
    backgroundColor: '#D1D5DB',
    width: 40,
  },
  bottomSheetContent: {
    flex: 1,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 120,
    backgroundColor: '#F9FAFB',
  },
  sidebarItem: {
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  sidebarItemActive: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    borderLeftColor: '#A855F7',
  },
  sidebarText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
  sidebarTextActive: {
    fontWeight: '500',
    color: '#1F2937',
  },
  sidebarTextWithBadge: {
    color: '#A855F7',
    fontWeight: '500',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 80,
  },
  filterSection: {
    gap: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#A855F7',
    borderColor: '#A855F7',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: -2,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: '#374151',
    flex: 1,
  },
  filterFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productCount: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  footerButtons: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    gap: 8,
  },
  clearButton: {
    width: '45%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  applyButton: {
    width: '45%',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#A855F7',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Slider Styles
  sliderContainer: {
    width: SLIDER_WIDTH,
    marginTop: 20,
    alignSelf: 'center',
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A855F7',
  },
  trackBackground: {
    height: 4,
    backgroundColor: '#E5E7EB',
    position: 'relative',
    justifyContent: 'center',
  },
  trackHighlight: {
    height: 4,
    backgroundColor: '#A855F7',
    position: 'absolute',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#A855F7',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});