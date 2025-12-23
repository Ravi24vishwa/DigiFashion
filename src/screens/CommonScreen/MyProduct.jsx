import { StyleSheet, Text, View, Switch, TouchableOpacity, FlatList, Image, SafeAreaView } from 'react-native'
import React, { useState, useCallback } from 'react'
import { CommonHeader } from '../../components/CommonHeader'
import { saleItems } from '../../data/productdata'; // Mock data
import { useFavorites } from '../../contexts/FavoritesContext';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useFocusEffect } from '@react-navigation/native';
import { useTabBarVisibility } from '../../contexts/TabBarVisibilityContext';

const MyProduct = ({ navigation, route }) => {
    const { setIsTabBarVisible } = useTabBarVisibility();
    const [activeTab, setActiveTab] = useState(route.params?.tab || 'Wishlist');
    const [showStockOnly, setShowStockOnly] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const { getFavorites, toggleFavorite, isFavorite } = useFavorites();

    useFocusEffect(
        useCallback(() => {
            setIsTabBarVisible(false);
            setRefresh(prev => prev + 1); // Force re-calculate products on focus
            return () => setIsTabBarVisible(true);
        }, [setIsTabBarVisible])
    );

    // Filter products based on active tab
    const getTabProducts = () => {
        switch (activeTab) {
            case 'Wishlist':
                const favoriteIds = getFavorites();
                return saleItems.filter(item => favoriteIds.includes(item.id));
            case 'Shared':
                return saleItems.filter(item => item.IsShared);
            case 'Viewed':
                return saleItems.filter(item => item.IsViewed);
            default:
                return [];
        }
    };

    const tabProducts = getTabProducts();

    // Further filter by stock if needed
    const displayedProducts = showStockOnly
        ? tabProducts.filter(item => item.stock === 'In Stock')
        : tabProducts;

    const tabs = ['Wishlist', 'Shared', 'Viewed'];

    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    // Empty State Component
    const EmptyState = () => {
        let config = {
            Wishlist: {
                image: require('../../assets/images/MyProduct/WishlistBg.png'),
                title: 'No Products in your wishlist',
                subtitle: 'It is simple! just tap on ❤️ to add any product to \nyour Wishlist'
            },
            Shared: {
                image: require('../../assets/images/MyProduct/SharedBg.png'),
                title: 'No Products Shared',
                subtitle: 'It is simple! just tap on 🔗 to add any product to \nyour Shared'
            },
            Viewed: {
                image: require('../../assets/images/MyProduct/WishlistBg.png'), // Reuse wishlist bg if no viewed bg
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
                    <Text style={styles.viewProductText}>View Product</Text>
                </TouchableOpacity>
            </View>
        );
    };

    // Render product card for grid
    const renderProductCard = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ProductDetailScreen', item)}
            style={styles.productCard}
        >
            {/* Product Image */}
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.productImage} />
                {item.discount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{item.discount}%</Text>
                    </View>
                )}
                {/* Favorite Button */}
                <TouchableOpacity
                    onPress={() => toggleFavorite(item)}
                    style={styles.favoriteBtn}
                >
                    <Image
                        source={
                            isFavorite(item.id) ? require('../../assets/icons/Heart.png') :
                                require('../../assets/icons/Heart1.png')}
                        style={styles.favoriteIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* Product Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.productTitle} numberOfLines={2}>
                    {item.title || item.name}
                </Text>

                {/* Price */}
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>₹{item.price}</Text>
                    {item.oldPrice && (
                        <Text style={styles.oldPrice}>₹{item.oldPrice}</Text>
                    )}
                </View>

                {/* Rating */}
                {item.rating && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {[...Array(5)].map((_, index) => (
                            <Image
                                key={index}
                                source={index < Math.floor(item.rating)
                                    ? require('../../assets/icons/Star.png')
                                    : require('../../assets/icons/Star1.png')
                                }
                                style={{
                                    width: 18,
                                    height: 18,
                                    marginHorizontal: 1,
                                }}
                            />
                        ))}
                        {item.reviews.length && (
                            <Text style={{
                                fontSize: 12,
                                color: '#9B9B9B',
                                marginLeft: 4
                            }}>
                                ({item.reviews.length})
                            </Text>
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <CommonHeader
                title="My Product"
                showBack={true}
                showSearch={true}
                showCart={true}
                onBackPress={() => navigation.goBack()}
                onSearchPress={() => navigation.navigate('SearchBarScreen')}
            />

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
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
                    </TouchableOpacity>
                ))}
            </View>

            {/* Stock Toggle */}
            <View style={styles.stockToggleContainer}>
                <Text style={styles.stockToggleText}>Show in stock product only</Text>
                <Switch
                    trackColor={{ false: "#D1D5DB", true: "#6366F1" }}
                    thumbColor="#fff"
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setShowStockOnly(!showStockOnly)}
                    value={showStockOnly}
                />
            </View>

            {/* Product Grid or Empty State */}
            {displayedProducts.length > 0 ? (
                <FlatList
                    data={displayedProducts}
                    renderItem={renderProductCard}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.gridContent}
                    scrollEnabled={true}
                    key={activeTab} // Force re-render on tab change
                />
            ) : (
                <EmptyState />
            )}
        </SafeAreaView>
    )
}

export default MyProduct

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: 10,
    },
    tab: {
        paddingVertical: 12,
        marginRight: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#637BDD',
    },
    tabText: {
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#637BDD',
        fontWeight: '600',
    },
    stockToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 10,
    },
    stockToggleText: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '500',
    },
    gridContent: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    productCard: {
        width: '48%',
        marginBottom: 15,
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#eee',
        borderRadius: 12,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#637BDD',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 10,
    },
    discountText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
    },
    favoriteBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 50,
        padding: 8,
    },
    favoriteIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    detailsContainer: {
        padding: 10,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 6,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    rating: {
        fontSize: 12,
        fontWeight: '600',
        color: '#F59E0B',
        marginRight: 4,
    },
    ratingCount: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    oldPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        marginLeft: 6,
    },
    addButton: {
        backgroundColor: '#637BDD',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: responsiveHeight(6),
        // backgroundColor: 'red',
    },
    emptyImage: {
        width: responsiveWidth(60),
        height: responsiveWidth(60),
        resizeMode: 'contain',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 18,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 25,
        marginBottom: 30,
    },
    viewProductBtn: {
        borderWidth: 1.5,
        borderColor: '#637BDD',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#fff',
    },
    viewProductText: {
        color: '#637BDD',
        fontSize: 18,
        fontWeight: '700',
    },
});
