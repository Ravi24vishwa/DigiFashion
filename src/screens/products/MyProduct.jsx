import { StyleSheet, Text, View, Switch, TouchableOpacity, FlatList, Image, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState, useCallback } from 'react'
import { CommonHeader } from '../../components/layout/CommonHeader'
import { saleItems } from '../../constants/data/productdata';
import { useFavorites, useAppUI } from '../../hooks'; // Consolidated hook import
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useFocusEffect } from '@react-navigation/native';

import { useSelector } from 'react-redux';

import ProductGrid from '../../components/features/products/ProductGrid';

const MyProduct = ({ navigation, route }) => {
    const { setIsTabBarVisible } = useAppUI();
    const [activeTab, setActiveTab] = useState(route.params?.tab || 'Wishlist');
    const [showStockOnly, setShowStockOnly] = useState(false);
    const { toggleFavorite, isFavorite, refreshFavorites, removeFavoriteLocally } = useFavorites();
    // Fetch full favorite product details from Redux (populated by fetchFavorites)
    const favoriteItems = useSelector(state => state.favorites.items);
    const favoriteIdsInState = useSelector(state => state.favorites.favoriteIds);
    const isLoading = useSelector(state => state.favorites.isLoading);

    useFocusEffect(
        useCallback(() => {
            setIsTabBarVisible(false);
            refreshFavorites(); // Fetch latest favorites from API when screen focused
            return () => setIsTabBarVisible(true);
        }, [setIsTabBarVisible, refreshFavorites])
    );

    // Filter products based on active tab
    const getTabProducts = () => {
        switch (activeTab) {
            case 'Wishlist':
                // Map API structure to UI structure for Wishlist items
                return (favoriteItems || []).map(item => {
                    const id = item.id || item.product_id;
                    const price = parseFloat(item.product_price || item.price || 0);
                    const oldPrice = parseFloat(item.product_mrp || item.oldPrice || 0);
                    const discount = item.product_discount || (oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0);

                    return {
                        ...item,
                        id: id,
                        title: item.product_name || item.name || item.title || 'Product',
                        price: price,
                        oldPrice: oldPrice,
                        image: item.product_thumbnail_image_url ? { uri: item.product_thumbnail_image_url } : (item.image || require('../../assets/images/MyProduct/WishlistBg.png')),
                        discount: discount,
                        rating: parseFloat(item.product_rating || item.rating || 0),
                        reviews: item.reviews || [],
                        stock: item.stock || 'In Stock',
                        isFavorite: true // By definition if in this list
                    };
                });
            case 'Viewed':
                return saleItems.filter(item => item.IsViewed).map(item => ({
                    ...item,
                    isFavorite: isFavorite(item.id)
                }));
            default:
                return [];
        }
    };

    const tabProducts = getTabProducts();

    // Further filter by stock if needed
    const displayedProducts = showStockOnly
        ? tabProducts.filter(item => item.stock === 'In Stock')
        : tabProducts;

    const tabs = ['Wishlist', 'Viewed'];

    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    // Empty State Component
    const EmptyState = () => {
        let config = {
            Wishlist: {
                image: require('../../assets/images/MyProduct/WishlistBg.png'),
                title: 'Your wishlist is empty',
                subtitle: 'It is simple! Just tap on ❤️ to add any product to \nyour Wishlist'
            },
            Viewed: {
                image: require('../../assets/images/MyProduct/WishlistBg.png'),
                title: 'No Products Viewed',
                subtitle: 'Start exploring our collection to see your recently viewed products!'
            }
        };

        const current = config[activeTab];

        return (
            <View style={styles.emptyContainer}>
                <Image source={current.image} style={styles.emptyImage} />
                <Text style={styles.emptyTitle}>{current.title}</Text>
                <Text style={styles.emptySubtitle}>{current.subtitle}</Text>
                <TouchableOpacity
                    style={styles.viewProductBtn}
                    onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
                >
                    <Text style={styles.viewProductText}>Explore Shop</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <CommonHeader
                title="My Products"
                showBack={true}
                showSearch={true}
                showCart={true}
                onBackPress={() => navigation.goBack()}
                onSearchPress={() => navigation.navigate('SearchBarScreen')}
            />

            {/* Premium Tabs Selection */}
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        activeOpacity={0.7}
                        style={[
                            styles.tab,
                            activeTab === tab && styles.activeTab
                        ]}
                        onPress={() => handleTabPress(tab)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText
                        ]}>
                            {tab}
                        </Text>
                        {activeTab === tab && (
                            <View style={styles.tabIndicator} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Stock Availability Toggle */}
            <View style={styles.stockToggleContainer}>
                <View>
                    <Text style={styles.stockToggleTitle}>Availability</Text>
                    <Text style={styles.stockToggleSubtitle}>Show only items in stock</Text>
                </View>
                <Switch
                    trackColor={{ false: "#E5E7EB", true: "#637BDD" }}
                    thumbColor="#fff"
                    ios_backgroundColor="#E5E7EB"
                    onValueChange={() => setShowStockOnly(!showStockOnly)}
                    value={showStockOnly}
                />
            </View>

            {/* List with Activity Indicator when loading */}
            {isLoading && !displayedProducts.length ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#637BDD" />
                </View>
            ) : (
                <>
                    {displayedProducts.length > 0 ? (
                        <ProductGrid
                            products={displayedProducts}
                            numColumns={2}
                            showOldPrice
                            showDiscount
                            showFavorite
                            cardWidth={responsiveWidth(44)}
                            imageHeight={200}
                            onProductPress={(item) => navigation.navigate('ProductDetailScreen', { slug: item.product_slug || item.id })}
                            onFavoritePress={(item) => toggleFavorite(item.id)}
                            onFavoriteLongPress={(item) => removeFavoriteLocally(item.id)}
                            contentContainerStyle={styles.gridContent}
                        />
                    ) : (
                        <EmptyState />
                    )}
                </>
            )}
        </SafeAreaView>
    )
}

export default MyProduct

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    tab: {
        paddingVertical: 16,
        marginRight: 32,
        position: 'relative',
        alignItems: 'center',
    },
    activeTab: {
        // No border bottom here as we use tabIndicator
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        width: '100%',
        backgroundColor: '#637BDD',
        borderRadius: 3,
    },
    tabText: {
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#637BDD',
    },
    stockToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#F9FAFB',
        marginVertical: 10,
    },
    stockToggleTitle: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '700',
    },
    stockToggleSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    gridContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        paddingTop: 10,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 100,
    },
    emptyImage: {
        width: responsiveWidth(70),
        height: responsiveWidth(70),
        resizeMode: 'contain',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 12,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    viewProductBtn: {
        backgroundColor: '#637BDD',
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 40,
        shadowColor: '#637BDD',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    viewProductText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
