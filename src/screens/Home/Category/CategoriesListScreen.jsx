import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import PagerView from 'react-native-pager-view';
import { kidsCategories, menCategories, womenCategories } from '../../../data/catogoryListScreenData'

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const tabs = [
  { name: 'Men', data: menCategories, color: '#4F46E5' },
  { name: 'Women', data: womenCategories, color: '#4F46E5' },
  { name: 'Kids', data: kidsCategories, color: '#4F46E5' },
];

const CategoriesListScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const pagerRef = useRef(null);
  const scrollOffset = useRef(new Animated.Value(0)).current;

  // Handle tab press
  const handleTabPress = (index) => {
    setSelectedTab(index);
    pagerRef.current?.setPage(index);
  };

  // Handle page change from pager
  const handlePageSelected = (e) => {
    setSelectedTab(e.nativeEvent.position);
  };

  // Animate underline position based on scroll
  const underlinePosition = scrollOffset.interpolate({
    inputRange: [0, SCREEN_WIDTH * (tabs.length - 1)],
    outputRange: [0, (responsiveWidth(100) - 40) / tabs.length * (tabs.length - 1)],
  });

  // Render individual category page
  const renderPage = (pageData, index) => (
    <View key={index} style={styles.page}>
      <FlatList
        data={pageData}
        renderItem={({ item }) => (
          <CategoryItem
            item={item}
            gender={tabs[index].name}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );



  // Calculate tab width
  const tabWidth = (responsiveWidth(100) - 40) / tabs.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity style={styles.searchButton} onPress={() => (navigation.navigate("SearchBarScreen"))}>
          <Image
            source={require('../../../assets/icons/search.png')}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsContainer}>
        <View style={styles.filterTabs}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={styles.filterTab}
              onPress={() => handleTabPress(index)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === index && styles.activeTabText,
                ]}
              >
                {tab.name}
              </Text>
              {selectedTab === index && (
                <View style={[styles.activeDot, { backgroundColor: tab.color }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Animated Underline */}
        <Animated.View
          style={[
            styles.tabUnderline,
            {
              width: tabWidth,
              backgroundColor: tabs[selectedTab]?.color || '#5B6BEE',
              transform: [{ translateX: underlinePosition }],
            },
          ]}
        />
      </View>

      {/* Slidable Pages */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
        onPageScroll={(e) => {
          const offset = e.nativeEvent.offset + e.nativeEvent.position;
          scrollOffset.setValue(offset * SCREEN_WIDTH);
        }}
        scrollEnabled={true}
      >
        {tabs.map((tab, index) => renderPage(tab.data, index))}
      </PagerView>
    </SafeAreaView>
  );
};

// Category Item Component
const CategoryItem = React.memo(({ item, gender, navigation }) => (
  <TouchableOpacity
    style={styles.categoryCard}
    onPress={() => navigation.navigate('CategoryProducts', {
      categoryName: item.name,
      gender: gender
    })}
  >
    <Image source={item.image} style={styles.categoryImage} />
    <View style={styles.categoryInfo}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryItems}>{item.items}</Text>
    </View>
    <Image
      source={require('../../../assets/icons/Forward.png')}
      style={styles.arrowIcon}
    />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#1F2937',
    paddingLeft: responsiveWidth(35),
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#6B7280',
  },
  filterTabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    position: 'relative',
    // backgroundColor: 'red'
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  activeDot: {
    // width: 6,
    // height: 6,
    // borderRadius: 3,
    // position: 'absolute',
    // bottom: 6,
  },
  tabUnderline: {
    height: 3,
    borderRadius: 2,
    marginTop: 1,
    // elevation: 10
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryImage: {
    width: 100,
    height: 115,
    borderRadius: 10,
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 16,
  },
  categoryName: {
    fontSize: 23,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryItems: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5DA7EC',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#9CA3AF',
    marginRight: 10,
  },
});

export default CategoriesListScreen;