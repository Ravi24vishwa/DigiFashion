import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

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

export const FilterBottomSheet = ({
  bottomSheetRef,
  snapPoints,
  filterSections,
  selectedFilters,
  onFilterChange,
  onClearAll,
  onApply,
  setIsTabBarVisible
}) => {
  const [activeSection, setActiveSection] = useState(filterSections[0]?.key || '');

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

  // Handle sheet open/close to toggle tab bar
  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      // Sheet closed
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

  // Count total selected filters
  const totalSelectedCount = useMemo(() => {
    return Object.values(selectedFilters).reduce(
      (sum, filters) => sum + (filters?.length || 0),
      0
    );
  }, [selectedFilters]);

  // Get active section data
  const activeSectionData = useMemo(() => {
    return filterSections.find(section => section.key === activeSection);
  }, [activeSection, filterSections]);

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
        {/* Header */}
        <View style={styles.filterHeader}>
          <Text style={styles.drawerTitle}>Filters</Text>
        </View>

        {/* Filter Content */}
        <View style={styles.mainContent}>
          {/* Left Sidebar - Categories */}
          <View style={styles.sidebar}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {filterSections.map((section) => {
                const sectionCount = selectedFilters[section.key]?.length || 0;
                const isActive = activeSection === section.key;
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
                      sectionCount > 0 && styles.sidebarTextWithBadge
                    ]}>
                      {section.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Right Content - Filter Options */}
          <View style={styles.contentArea}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {activeSectionData && (
                <View style={styles.filterSection}>
                  {activeSectionData.options.map((option) => (
                    <CustomCheckbox
                      key={option.id}
                      checked={selectedFilters[activeSectionData.key]?.includes(option.label)}
                      onPress={() => handleFilterToggle(activeSectionData.key, option.label)}
                      label={option.label}
                    />
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.filterFooter}>
          <View style={styles.footerContent}>
            <Text style={styles.productCount}>
              {/* {totalSelectedCount > 0 ? `${totalSelectedCount} filters applied` : '1000+ Products'} */}
              {'1000+ Products'}
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
    width: 110,
    backgroundColor: '#F9FAFB',
  },
  sidebarItem: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
  },
  sidebarItemActive: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
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
    color: '#6366F1',
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
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
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
    // backgroundColor: 'red'
  },
  clearButton: {
    width: '45%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    minWidth: 70,
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
    backgroundColor: '#6366F1',
    minWidth: 70,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});