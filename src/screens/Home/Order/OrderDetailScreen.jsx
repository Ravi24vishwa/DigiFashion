import React, { useRef, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    Dimensions,
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { CommonHeader } from '../../../components/layout/CommonHeader';
import { RateReviewSheet } from '../../../components/features/products/RateReviewSheet';
import { useAppUI, useOrders } from '../../../hooks';
import { orderService } from '../../../api/orderService';
import { ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');

const OrderDetailScreen = ({ navigation, route }) => {
    const { order: initialOrder } = route.params || {};
    const [order, setOrder] = useState(initialOrder);
    const [isOrderLoading, setIsOrderLoading] = useState(!initialOrder?.order_items);
    const reviewSheetRef = useRef(null);
    const { setIsTabBarVisible } = useAppUI();
    const { fetchOrderDetails } = useOrders();
    const [rating, setRating] = useState(1);

    const reviewSnapPoints = useMemo(() => ['70%'], []);

    useEffect(() => {
        const getDetails = async () => {
            if (initialOrder?.id && !initialOrder.order_items) {
                try {
                    setIsOrderLoading(true);
                    const details = await fetchOrderDetails(initialOrder.id);
                    setOrder(details);
                } catch (err) {
                    console.error('Order Details Error:', err);
                } finally {
                    setIsOrderLoading(false);
                }
            }
        };
        getDetails();
    }, [initialOrder, fetchOrderDetails]);

    const handleCopyId = () => {
        Alert.alert('Success', 'Order ID copied to clipboard!');
    };

    const handleSendReview = async (reviewData) => {
        try {
            await orderService.addReview({
                product_id: order?.order_items?.[0]?.product_id || order?.product_id,
                rating: reviewData.rating,
                review: reviewData.reviewText
            });
            Alert.alert('Thank you!', 'Your review has been submitted.');
            reviewSheetRef.current?.close();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to submit review');
        }
    };

    const handleShare = () => {
        if (order?.id) {
            // Update local object
            order.IsShared = true;
            // Update global source
            const sourceItem = saleItems.find(p => p.id === order.id);
            if (sourceItem) {
                sourceItem.IsShared = true;
            }
            Alert.alert('Shared', 'Product shared and added to Shared tab!', [
                { text: 'View', onPress: () => navigation.navigate('MyProduct', { tab: 'Shared' }) },
                { text: 'OK' }
            ]);
        }
    };

    const TrackingItem = ({ status, time, isCompleted, isFirst, isLast }) => (
        <View style={styles.trackingItem}>
            <View style={styles.trackingLeft}>
                <View style={[
                    styles.trackingDot,
                    { backgroundColor: isCompleted ? '#637BDD' : '#E5E7EB' }
                ]} />
                {!isLast && <View style={[
                    styles.trackingLine,
                    { backgroundColor: isCompleted ? '#637BDD' : '#E5E7EB' }
                ]} />}
            </View>
            <View style={styles.trackingRight}>
                <Text style={[
                    styles.trackingStatus,
                    { color: isCompleted ? '#000' : '#9CA3AF' }
                ]}>{status}</Text>
                <Text style={styles.trackingTime}>{time}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <CommonHeader
                title="Order Details"
                showBack={true}
                showSearch={true}
                showCart={true}
                onBackPress={() => navigation.goBack()}
            />

            {isOrderLoading ? (
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#637BDD" />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Order ID Section */}
                    <View style={styles.section}>
                        <View style={styles.idRow}>
                            <Text style={styles.orderIdLabel}>Order ID {order?.id || order?.order_id || '000000000000'}</Text>
                            <TouchableOpacity onPress={handleCopyId}>
                                <Text style={styles.copyText}>COPY</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.paymentMode}>Payment Mode <Text style={{ fontWeight: '700', color: '#000' }}>{order?.payment_method || 'Cash on Delivery'}</Text></Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Address Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Delivery Address</Text>
                        <Text style={styles.addressName}>{order?.user_address?.title || order?.name || 'Customer'}</Text>
                        <Text style={styles.addressText}>
                            {order?.user_address?.address || order?.address || 'No address provided'}
                            {order?.user_address?.apt ? `, ${order.user_address.apt}` : ''}
                            {order?.user_address?.city ? `\n${order.user_address.city}, ${order.user_address.zipcode}` : ''}
                        </Text>
                        <Text style={styles.phoneNumber}>{order?.user_address?.phone || order?.phone || ''}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Help Centre */}
                    <TouchableOpacity
                        style={styles.clickableRow}
                        onPress={() => navigation.navigate('HelpCentre', { order })}
                    >
                        <Text style={styles.clickableText}>Help Centre</Text>
                        <Image source={require('../../../assets/icons/Back.png')} style={styles.chevronIcon} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* Product Card */}
                    {(order?.order_items || [order]).map((item, index) => (
                        <View key={index.toString()} style={styles.productCard}>
                            <View style={styles.productInfo}>
                                <Image source={item.product_thumbnail_image_url ? { uri: item.product_thumbnail_image_url } : (item.image || require('../../../assets/images/HomeScreenImages/Dress1.png'))} style={styles.productImage} />
                                <View style={styles.productTextContainer}>
                                    <Text style={styles.productTitle}>{item.product_name || item.title || 'Product'}</Text>
                                    <Text style={styles.productPrice}>₹{parseFloat(item.product_price || item.price || 0).toFixed(2)}</Text>
                                    <Text style={styles.productVariant}>Size: {item.size || 'N/A'}  Qty: {item.qty || 1}</Text>
                                </View>
                                <Image source={require('../../../assets/icons/Back.png')} style={styles.chevronIcon} />
                            </View>

                            <View style={styles.innerDivider} />

                            {/* Rating Section */}
                            <View style={styles.ratingSection}>
                                <Text style={styles.ratingMsg}>We are glad you loved the product</Text>
                                <View style={styles.starsContainer}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <TouchableOpacity key={s} onPress={() => {
                                            setRating(s);
                                            reviewSheetRef.current?.expand();
                                        }}>
                                            <Image
                                                source={rating >= s ? require('../../../assets/icons/Star.png') : require('../../../assets/icons/Star1.png')}
                                                style={styles.starIconLarge}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ))}

                    <View style={styles.divider} />

                    {/* Order Tracking */}
                    <View style={styles.productCard}>
                        <Text style={styles.sectionTitle}>Order Tracking</Text>
                        <View style={styles.trackingList}>
                            <TrackingItem status="Order Placed" time={order?.created_at || "N/A"} isCompleted={true} isFirst={true} />
                            <TrackingItem status="Shipped" time="--" isCompleted={order?.status?.toLowerCase() === 'shipped' || order?.status?.toLowerCase() === 'delivered'} />
                            <TrackingItem status="Delivered" time="--" isCompleted={order?.status?.toLowerCase() === 'delivered'} isLast={true} />
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.outlineButton} onPress={() => { console.log('Open Tracking Link') }}>
                                <Image source={require('../../../assets/icons/OpenLink.png')} style={[styles.btnIcon, { width: 20, height: 20 }]} />
                                <Text style={[styles.outlineButtonText, { marginLeft: 3 }]}>Open Tracking Link</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.outlineButton} onPress={handleShare}>
                                <Image source={require('../../../assets/icons/share.png')} style={styles.btnIcon} />
                                <Text style={styles.outlineButtonText}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Price Details */}
                    <View style={styles.section}>
                        <Text style={styles.priceSectionTitle}>Price Details ({order?.order_items?.length || 1} item)</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Total Product Price</Text>
                            <Text style={styles.priceValue}>₹{parseFloat(order?.sub_total || order?.price || 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Shipping</Text>
                            <Text style={styles.priceValue}>₹{parseFloat(order?.shipping_charges || 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>GST/Tax</Text>
                            <Text style={styles.priceValue}>₹{parseFloat(order?.tax || 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Coupon Discount</Text>
                            <Text style={[styles.priceValue, { color: '#10B981' }]}>- ₹{parseFloat(order?.coupon_discount || 0).toFixed(2)}</Text>
                        </View>
                        <View style={[styles.innerDivider, { marginVertical: 10 }]} />
                        <View style={styles.priceRow}>
                            <Text style={styles.totalLabel}>Order Total</Text>
                            <Text style={styles.totalValue}>₹{parseFloat(order?.grand_total || order?.total || 0).toFixed(2)}</Text>
                        </View>
                    </View>
                </ScrollView>
            )}

            <RateReviewSheet
                bottomSheetRef={reviewSheetRef}
                snapPoints={reviewSnapPoints}
                product={order}
                onSubmitReview={handleSendReview}
                setIsTabBarVisible={setIsTabBarVisible}
                showMedia={false}
            />
        </View>
    );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    section: {
        padding: 20,
    },
    divider: {
        height: 8,
        backgroundColor: '#F3F4F6',
    },
    innerDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 15,
    },
    idRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orderIdLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    copyText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#637BDD',
    },
    paymentMode: {
        fontSize: 14,
        color: '#6B7280',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 15,
    },
    addressName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 8,
    },
    phoneNumber: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    clickableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    clickableText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    chevronIcon: {
        width: 20,
        height: 20,
        tintColor: '#000',
        transform: [{ rotate: '180deg' }],
    },
    productCard: {
        margin: 15,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    productTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginVertical: 4,
    },
    productVariant: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    ratingSection: {
        alignItems: 'center',
        marginTop: 10,
    },
    ratingMsg: {
        fontSize: 12,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 20,
    },
    starIconLarge: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    followBox: {
        backgroundColor: '#F0F4FF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    followText: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
        marginRight: 10,
    },
    followButton: {
        fontSize: 12,
        fontWeight: '700',
        color: '#637BDD',
    },
    trackingList: {
        paddingLeft: 10,
        marginBottom: 20,
    },
    trackingItem: {
        flexDirection: 'row',
        height: 70,
    },
    trackingLeft: {
        alignItems: 'center',
        width: 20,
    },
    trackingDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        zIndex: 1,
    },
    trackingLine: {
        width: 2,
        flex: 1,
        marginTop: -2,
        marginBottom: -2,
    },
    trackingRight: {
        marginLeft: 15,
        flex: 1,
    },
    trackingStatus: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
    },
    trackingTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    outlineButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#637BDD',
    },
    outlineButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    btnIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },
    priceSectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#000',
    }
});
