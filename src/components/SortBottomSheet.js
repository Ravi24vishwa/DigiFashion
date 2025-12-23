import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetBackdrop,
  BottomSheetView
} from '@gorhom/bottom-sheet';

export const SortBottomSheet = ({
  bottomSheetRef,
  snapPoints,
  sortOptions,
  selectedSort,
  onSelectSort,
  setIsTabBarVisible // ✅ RECEIVING tab bar setter
}) => {

  // ✅ FIXED: Backdrop component
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

  // ✅ FIXED: MOST IMPORTANT - Handle sheet open/close to toggle tab bar
  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      // Sheet closed ✅ SHOW tab bar
      setIsTabBarVisible?.(true);
    }
  }, [setIsTabBarVisible]);

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[
          styles.sortOption,
          selectedSort === item.label && styles.selectedSortOption,
        ]}
        onPress={() => onSelectSort(item)}
      >
        <Text
          style={[
            styles.sortOptionText,
            selectedSort === item.label && styles.selectedSortOptionText,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    ),
    [selectedSort, onSelectSort]
  );

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <Text style={styles.drawerTitle}>Sort by</Text>
    </View>
  ), []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // Start closed
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      onChange={handleSheetChanges} // ✅ THIS IS THE KEY FIX!
    >
      <BottomSheetView style={styles.contentContainer}>
        <FlatList
          data={sortOptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  contentContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sortOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  sortOptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
  },
  selectedSortOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  selectedSortOption: {
    backgroundColor: '#5B6BEE',
  },
});
