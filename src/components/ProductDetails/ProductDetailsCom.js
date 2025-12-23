import { useRoute } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';


// Header Component
export const Header = ({ onBack, onShare, navigation, onPress, onFavoritePress, onAddToCart }) => {
  return <View style={styles.header}>
    <TouchableOpacity
      // style={styles.skipButton}
      onPress={onPress}
    >
      <Image
        source={require('../../assets/icons/Back.png')}
        style={styles.ArrowStyle}
      />
    </TouchableOpacity>
    <View style={styles.headerRight}>
      <TouchableOpacity onPress={() => navigation && navigation.navigate('SearchBarScreen')}>
        <Image
          source={require('../../assets/icons/baseline-search.png')}
          style={styles.RightSideIcons}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onFavoritePress}>
        <Image
          source={
            // item.isFavorite
            // ? require('../../assets/icons/Heart.png')  
            //  : require('../../assets/icons/BaseLine-Heart.png')
            require('../../assets/icons/BaseLine-Heart.png')
          }
          style={styles.RightSideIcons}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onAddToCart}>
        <Image
          source={
            require('../../assets/icons/Buy1.png')
          }
          style={styles.RightSideIcons}
        />
      </TouchableOpacity>
    </View>
  </View>
}


// Size and color Selector Component
export const SizeSelector = ({ item, selectedColor, selectedSize, onAddToCart, onBuyNow }) => {
  return (
    <TouchableOpacity style={[styles.sizeAndColorSection]}
      onPress={onAddToCart}
    >
      {/* leftside section - Color */}
      <View style={styles.Row}>
        <Text style={styles.centerText}>{selectedColor || item.color?.[0] || 'Color'}</Text>
        <Text style={styles.subText}>Color({item.color?.length})</Text>
      </View>
      {/* Vertical Separator */}
      <View style={{ width: 1, height: '100%', backgroundColor: '#E0E0E0', marginLeft: 10, marginRight: 10 }} />

      {/* rightside section - Size */}
      <View style={styles.Row}>
        <Text style={styles.centerText}>{selectedSize || item.size?.[0] || 'Size'}</Text>
        <Text style={styles.subText}>Size({item.size?.length})</Text>
      </View>
    </TouchableOpacity>
  );
};

// Product Details Component
export const ProductDetails = () => {
  const route = useRoute();

  const { title, fabric, SleeveLength, Pattern } = route.params

  const handleCopy = () => {
    Alert.alert('Success', 'Product Details copied to clipboard!');
  };
  return (
    <View style={styles.detailsSection}>
      <View style={styles.detailsHeader}>
        <Text style={styles.sectionTitle}>Product Details</Text>
        <TouchableOpacity onPress={handleCopy}>
          <Text style={styles.link}>Copy</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Name</Text>
        <Text style={styles.detailValue}>: {title}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Fabric</Text>
        <Text style={styles.detailValue}>: {fabric}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Sleeve Length</Text>
        <Text style={styles.detailValue}>: {SleeveLength}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Pattern</Text>
        <Text style={styles.detailValue}>: {Pattern}</Text>
      </View>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#637BDD' }}>Read More</Text>
    </View>
  );
};

//rating and Review
export const RatingAndReview = ({ item, onpress, reviews = [] }) => {
  // Compute rating distribution from provided reviews array
  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length
  }));

  const totalReviewsCount = reviews.length;
  // If item.reviewCount is provided and greater than our actual reviews array length, 
  // we use it as the "total ratings" denominator to match the image's "counts" style.
  // Actually, let's just use the sum of counts in distribution or item.reviewCount.
  const totalRatings = reviews.length;
  // const totalRatings = item?.reviewCount || reviews.length;
  const overallRating = item?.rating || (reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0);

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4) return 'Very Good';
    if (rating >= 3) return 'Good';
    if (rating >= 2) return 'Average';
    return 'Poor';
  };

  return (
    <View style={{ width: '100%', marginBottom: 30, paddingHorizontal: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 18, color: '#000', fontWeight: '700' }}>Rating & Reviews</Text>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: 'white',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 10
          }}
          onPress={() => onpress && onpress()}
        >
          <Text style={{ fontSize: 18, color: '#637BDD', fontWeight: '600' }}>Rate Product</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Left Side: Summary */}
        <View style={{ width: '40%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#000', fontSize: 24, fontWeight: '500' }}>
            {totalRatings > 0 ? getRatingLabel(overallRating) : 'No Rating'}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8 }}>
            {[...Array(5)].map((_, index) => (
              <Image
                key={index}
                source={index < Math.floor(overallRating)
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
          </View>
          <Text style={{ color: '#9E9E9E', fontSize: 15, fontWeight: '500', textAlign: 'center' }}>
            {`${totalRatings} ratings and`}
          </Text>
          <Text style={{ color: '#9E9E9E', fontSize: 15, fontWeight: '500', textAlign: 'center' }}>
            {`${totalReviewsCount} reviews`}
          </Text>
        </View>

        {/* Vertical Separator */}
        <View style={{ width: 1, height: '80%', backgroundColor: '#E0E0E0', marginLeft: 10, marginRight: 20 }} />

        {/* Right Side: Bars */}
        <View style={{ flex: 1 }}>
          {distribution.map((d, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ flex: 1, height: 8, backgroundColor: '#EEEEEE', borderRadius: 4, overflow: 'hidden' }}>
                <View
                  style={{
                    width: totalRatings > 0 ? `${(d.count / totalRatings) * 100}%` : '0%',
                    height: '100%',
                    backgroundColor: '#637BDD',
                    borderRadius: 4
                  }}
                />
              </View>
              <Text style={{ width: 25, textAlign: 'right', fontSize: 14, color: '#9E9E9E', marginLeft: 15 }}>
                {d.count}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};


// Review Component
export const ReviewItem = ({ name, date, rating, review, isReviewLiked }) => {
  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name[0]}</Text>
        </View>
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewName}>{name}</Text>
          <View style={styles.reviewRating}>
            {[...Array(5)].map((_, i) => (
              <Image
                key={i}
                source={i < Math.floor(rating)
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
          </View>
          <Text style={styles.reviewDate}>{date}</Text>
        </View>
      </View>
      <Text style={styles.reviewText}>{review}</Text>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }} onPress={() => console.log('Helpful pressed')  }>
        <Text style={{color: '#9E9E9E', marginTop: 23, fontStyle: 'italic'}}>Helpful</Text>
        <Image
          source={require('../../assets/icons/Like.png')}
          style={{ width: '8%', height: responsiveHeight(2.2), marginTop: responsiveHeight(2),  alignItems: 'center' }}
        />
      </TouchableOpacity>
    </View>
  );
};

// Reviews Section Component
export const ReviewsSection = ({ reviews, averageRating, totalReviews }) => {
  const [IsfullReview, setIsfullReview] = useState(false)
  return (
    <View style={styles.reviewsSection}>
      <View style={styles.reviewsHeader}>
        <Text style={[styles.sectionTitle, { fontSize: 28 }]}>{totalReviews} reviews</Text>
        {/* <View style={styles.ratingBadge}>
        <Text style={styles.ratingBadgeText}>★ {averageRating}</Text>
      </View> */}
      </View>
      {!IsfullReview ? reviews.slice(0, 2).map((review, index) => (
        <ReviewItem key={index} {...review} />
      )) : reviews.map((review, index) => (
        <ReviewItem key={index} {...review} />
      ))}

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.loadMoreButton}
        onPress={() => setIsfullReview(!IsfullReview)}
      >
        <Text style={styles.loadMoreText}>{IsfullReview ? 'See Few Reviews' : 'See All Reviews'}</Text>
        <Image
          source={!IsfullReview ? require('../../assets/icons/DownArrow1.png') : require('../../assets/icons/UpArrow.png')}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

// Similar Products Component
export const SimilarProducts = ({ products }) => {
  return (
    <View style={styles.similarSection}>
      <Text style={styles.sectionTitle}>Similar To</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product, index) => (
          <View key={index} style={styles.similarCard}>
            <Image source={{ uri: product.image }} style={styles.similarImage} />
            <Text style={styles.similarPrice}>₹{product.price}</Text>
            {product.discount && (
              <Text style={styles.similarDiscount}>${product.originalPrice}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Bottom Action Bar Component
export const BottomActionBar = ({ onAddToCart, onBuyNow }) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.addToCartButton} onPress={onAddToCart}>
        <Image
          source={
            require('../../assets/icons/Buy1.png')
          }
          style={styles.addToCartIcon}
        />
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buyNowButton} onPress={onBuyNow}>
        <Text style={styles.buyNowText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  ArrowStyle: {
    height: responsiveHeight(2),
    width: responsiveWidth(3),
    // backgroundColor: 'black'
    tintColor: 'black'
  },
  RightSideIcons: {
    height: responsiveHeight(3),
    width: responsiveWidth(5.5),
    // backgroundColor: 'black'
    tintColor: 'black'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 16,
    // paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    // marginHorizontal: 8,
  },
  headerRight: {
    flexDirection: 'row',
    gap: responsiveWidth(5),
  },
  imageContainer: {
    width: '100%',
    height: '30%',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    height: responsiveHeight(2),
    width: responsiveWidth(3),
    color: '#ffa500',
    fontSize: 16,
    marginRight: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9E9E9E'
  },
  sizeAndColorSection: {
    height: responsiveHeight(10),
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    alignSelf: 'center',
    // marginTop: 10,
  },
  Row: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    // borderLeftWidth: 1
  },
  centerText: {
    color: '#637BDD',
    fontWeight: '600',
    fontSize: 22
  },
  subText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#9E9E9E'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  loadMoreButton: {
    elevation: 2,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: responsiveHeight(6.5),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  loadMoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  arrowIcon: {
    height: responsiveHeight(1.3),
    width: responsiveWidth(5.5),
    color: '#000',
    resizeMode: 'contain',
    // backgroundColor: 'red',
    marginTop: 5
  },
  // sizeRow: {
  //   flexDirection: 'row',
  // },
  // sizeButton: {
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: '#ddd',
  //   backgroundColor: '#fff',
  // },
  // sizeButtonSelected: {
  //   backgroundColor: '#4169e1',
  //   borderColor: '#4169e1',
  // },
  // sizeText: {
  //   fontSize: 14,
  //   fontWeight: '600',
  //   color: '#666',
  // },
  // sizeTextSelected: {
  //   color: '#fff',
  // },
  detailsSection: {
    marginBottom: 20,
    paddingTop: 20,
    // borderTopWidth: 1,
    // borderTopColor: '#eee',
    // backgroundColor: 'red'
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    // backgroundColor: 'yellow'
  },
  link: {
    color: '#4169e1',
    fontSize: 18,
    fontWeight: '600'
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 2,
    // backgroundColor: 'yellow'
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewsSection: {
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingBadge: {
    backgroundColor: '#4169e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4169e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
    // backgroundColor: 'red',
    // alignContent: 'flex-end',
    alignSelf: 'flex-end'
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  similarSection: {
    marginBottom: 80,
  },
  similarCard: {
    width: 150,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  similarImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  similarPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
    color: '#000',
  },
  similarDiscount: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4169e1',
    borderRadius: 15,
    paddingVertical: 14,
    gap: 8,
  },
  addToCartIcon: {
    height: responsiveHeight(2.9),
    width: responsiveWidth(4.9),
    tintColor: '#000'
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#637BDD',
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});