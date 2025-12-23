import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import BottomSheet, { BottomSheetFlatList, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

export const CategoryBottomSheet = ({
  bottomSheetRef,
  snapPoints,
  categoryOptions,
  selectedCategory,
  onSelectCategory,
  setIsTabBarVisible
}) => {
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

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[
          styles.categoryOption,
          selectedCategory === item.label && styles.selectedCategoryOption,
        ]}
        onPress={() => onSelectCategory(item)}
      >
        <Text
          style={[
            styles.categoryOptionText,
            selectedCategory === item.label && styles.selectedCategoryOptionText,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    ),
    [selectedCategory, onSelectCategory]
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <Text style={styles.drawerTitle}>Category</Text>
      </View>
    ),
    []
  );

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
      <BottomSheetView>
        <FlatList
          data={categoryOptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // backgroundColor: 'red',

  },
  handleIndicator: {
    backgroundColor: '#E5E7EB',
    width: 40,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  categoryOptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
  },
  selectedCategoryOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  selectedCategoryOption: {
    backgroundColor: '#5B6BEE',
  },
});