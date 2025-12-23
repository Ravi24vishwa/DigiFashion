import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { CommonHeader } from '../../../components/CommonHeader';
import { ordersData, filterOptions } from '../../../data/ordersData';
import { useCart } from '../../../contexts/CartContext';
import PromoBanner from '../../../CommonHelper/PromoBanner';

const { width } = Dimensions.get('window');

const OrderScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItems } = useCart();

  const filteredOrders = ordersData.filter(order => {
    const matchesFilter = activeFilter === 'All' || order.status === activeFilter;
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const OrderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetailScreen', { order: item })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderIdText}>Order ID {item.id}</Text>
        <Text style={styles.soldToText}>Sold to <Text style={{ fontWeight: '700', color: '#000' }}>{item.soldTo}</Text></Text>
      </View>
      <View style={styles.orderContent}>
        <View style={styles.productImageContainer}>
          <Image source={item.image} style={styles.productImage} />
        </View>
        <View style={styles.productDetails}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.productPrice}>₹{item.price.toFixed(2)}</Text>
          <View style={styles.variantInfo}>
            <Text style={styles.variantText}>Size: {item.size}</Text>
            <Text style={[styles.variantText, { marginLeft: 15 }]}>Qty: {item.qty}</Text>
          </View>
        </View>
        <Image
          source={require('../../../assets/icons/Back.png')}
          style={styles.chevronIcon}
        />
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      <Text style={styles.sectionTitle}>Your Orders</Text>

      <View style={styles.searchContainer}>
        <Image
          source={require('../../../assets/icons/baseline-search.png')}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your Orders"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View
        // horizontal
        // showsHorizontalScrollIndicator={false}
        // style={styles.filterScroll}
        // contentContainerStyle={styles.filterContainer}
        style={styles.filterContainer}
      >
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.activeFilterChip
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter && styles.activeFilterText
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Promo Banner */}
      <PromoBanner imageUrl={require('../../../assets/images/HomeScreenImages/PromoBanner1.png')} />

      <View style={{ height: 10 }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <CommonHeader
        title="My Orders"
        showSearch={true}
        showCart={true}
        cartBadgeCount={cartItems?.length || 0}
      />

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard item={item} />}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 25,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#9CA3AF',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  filterScroll: {
    marginTop: 20,
    paddingLeft: 20,
  },
  filterContainer: {
    paddingLeft: 10,
    gap: 10,
    // paddingBottom: 10,
    // backgroundColor: 'red',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 10,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#637BDD',
    backgroundColor: '#fff',
  },
  activeFilterChip: {
    backgroundColor: '#637BDD',
  },
  filterText: {
    fontSize: 20,
    color: '#637BDD',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },

  ordersList: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6',

  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  orderIdText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  soldToText: {
    fontSize: 13,
    color: '#6B7280',
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  variantInfo: {
    flexDirection: 'row',
    marginTop: 6,
  },
  variantText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  chevronIcon: {
    width: 18,
    height: 18,
    tintColor: '#000',
    transform: [{ rotate: '180deg' }], // Using back arrow as forward chevron
    opacity: 0.8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  }
});