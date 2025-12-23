// ==================== FilterBar.js ====================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export const FilterBar = ({ onSort, onCategory, onFilter }) => {
  return (
    <View style={styles.filterRow}>
      <TouchableOpacity style={styles.filterButton} onPress={onSort}>
        <Image
          source={require('../assets/icons/sort.png')}
          style={styles.filterIcon}
        />
        <Text style={styles.filterText}>Sort</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.filterButton} onPress={onCategory}>
        <Image
          source={require('../assets/icons/options.png')}
          style={styles.filterIcon}
        />
        <Text style={styles.filterText}>Category</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.filterButton} onPress={onFilter}>
        <Image
          source={require('../assets/icons/filter.png')}
          style={styles.filterIcon}
        />
        <Text style={styles.filterText}>Filter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  filterIcon: {
    width: 16,
    height: 16,
    tintColor: '#6B7280',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
});

