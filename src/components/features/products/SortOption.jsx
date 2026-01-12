import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');


const SortOption = () => {
    const [sortVisible, setSortVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(SCREEN_HEIGHT))[0];
    const [selectedSort, setSelectedSort] = useState('Popular');

    const sortOptions = [
    { id: '1', label: 'Popular', value: 'popular' },
    { id: '2', label: 'Newest', value: 'newest' },
    { id: '3', label: 'Customer review', value: 'review' },
    { id: '4', label: 'Price: lowest to high', value: 'price_low' },
    { id: '5', label: 'Price: highest to low', value: 'price_high' },
  ];

  
    const showSortDrawer = () => {
      setSortVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }).start();
    };
  
    const hideSortDrawer = () => {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setSortVisible(false);
      });
    };
  
    
  const handleSortSelect = (sortOption) => {
    console.log(sortOption)
    setSelectedSort(sortOption.label);
    hideSortDrawer();
    // Here you would typically sort your products based on the selected option
  };

   const renderSortOption = ({ item }) => (
      <TouchableOpacity
        style={[styles.sortOption, 
          selectedSort === item.label && styles.selectedSortOption,
        ]}
        onPress={() => handleSortSelect(item)}
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
    );
  return (
    <View>
      <Text>SortOption</Text>
        {/* Sort Drawer Modal */}
            <Modal
              visible={sortVisible}
              transparent
              animationType="none"
              onRequestClose={hideSortDrawer}
            >
              <View style={styles.modalOverlay}>
                {/* Background Overlay */}
                <TouchableWithoutFeedback onPress={hideSortDrawer}>
                  <View style={styles.overlay} />
                </TouchableWithoutFeedback>
      
                {/* Drawer Content */}
                <Animated.View
                  style={[  
                    styles.drawerContainer,
                    {
                      transform: [{ translateY: slideAnim }],
                      //  opacity: animatedValue
                    },
                  ]}
                >
                  {/* Drawer Handle */}
                  <View style={styles.drawerHandle} />
      
                  {/* Drawer Header */}
                  <View style={styles.drawerHeader}>
                    <Text style={styles.drawerTitle}>Sort by</Text>
                    <TouchableOpacity onPress={hideSortDrawer}>
                    </TouchableOpacity>
                  </View>
      
                  {/* Sort Options List */}
                  <FlatList
                    data={sortOptions}
                    renderItem={renderSortOption}
                    keyExtractor={(item) => item.id}
                    style={styles.sortList}
                    showsVerticalScrollIndicator={false}
                  />
      
                  {/* Apply Button */}
                  {/* <TouchableOpacity 
                    style={styles.applyButton}
                    onPress={hideSortDrawer}
                  >
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity> */}
                </Animated.View>
              </View>
            </Modal>
    </View>
  )
}

export default SortOption

const styles = StyleSheet.create({
    // Sort Drawer Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
  },
  drawerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    // backgroundColor: 'red'
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: '#6B7280',
  },
  sortList: {
    // paddingHorizontal: 20,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    width: '100%',
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
  selectedSortOption:{
    backgroundColor: '#5B6BEE'
  },
  checkIcon: {
    width: 20,
    height: 20,
    tintColor: '#5B6BEE',
  },
  applyButton: {
    backgroundColor: '#5B6BEE',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})