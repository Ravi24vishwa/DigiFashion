import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { categoryService } from '../../../api/categoryService';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CategoriesListScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchMainCategories();
  }, []);

  const fetchMainCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories({ isParent: "0" });
      setCategories(res.Data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async (parentId, index) => {
    if (subCategories[index]) return;

    try {
      const res = await categoryService.getCategories({ isParent: parentId });
      setSubCategories(prev => ({
        ...prev,
        [index]: res.Data || []
      }));
    } catch (error) {
      console.error(`Error fetching subcategories for parent ${parentId}:`, error);
    }
  };


  const tabWidth = categories.length > 0 ? (responsiveWidth(100) - 40) / categories.length : 0;

  if (loading && categories.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

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

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryItem
              item={item}
              gender={item.name}
              navigation={navigation}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No categories found</Text>
          }
        />
      )}

    </SafeAreaView>
  );
};

// Category Item Component
const CategoryItem = React.memo(({ item, gender, navigation }) => {
  const imageUrl = item.image_url;
  const data = item;
  return (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => navigation.navigate('CategoryProducts', {
        categoryId: item.id || item.category_id,
        categoryName: item.categorie_name,
        gender: gender
      })}
    >
      {console.log("category list data ====> ", data)}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.categoryImage} />
      ) : (
        <View style={[styles.categoryImage, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#9CA3AF' }}>No Image</Text>
        </View>
      )}
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName} numberOfLines={1}>{item.categorie_name}</Text>
        <Text style={styles.categoryItems}>
          {item.categorie_name || 'Explore'}
        </Text>
      </View>
      <Image
        source={require('../../../assets/icons/Forward.png')}
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );
});

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
    paddingTop: 10, // Reduced from 40 as SafeAreaView handles top padding
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
  activeDot: {},
  tabUnderline: {
    height: 3,
    borderRadius: 2,
    marginTop: 1,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 10,
  },
});

export default CategoriesListScreen;