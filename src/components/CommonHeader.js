import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

export const CommonHeader = ({
    title,
    showBack,
    showSearch,
    showCart,
    showWishlist,
    showShare,
    onBackPress,
    onSearchPress,
    onCartPress,
    // onWishlistPress,
    onSharePress,
    cartBadgeCount
}) => {
    const navigation = useNavigation();

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    const handleSearch = () => {
        if (onSearchPress) {
            onSearchPress();
        } else {
            navigation.navigate('SearchBarScreen');
        }
    };

    const handleCart = () => {
        if (onCartPress) {
            onCartPress();
        } else {
            navigation.navigate('Main', {
                screen: 'CartTab',
                params: {
                    screen: 'Cart'
                }
            });
        }
    };

    return (
        <View style={styles.headerContainer}>
            {/* Left Section: Back Button or Title if no back button */}
            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
                        <Image
                            source={require('../assets/icons/Back.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Center Section: Title */}
            <View style={styles.titleContainer}>
                {title && <Text style={styles.title}>{title}</Text>}
            </View>

            {/* Right Section: Actions */}
            <View style={styles.rightContainer}>
                {showSearch && (
                    <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
                        <Image
                            source={require('../assets/icons/baseline-search.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                )}

                {showShare && (
                    <TouchableOpacity onPress={onSharePress} style={styles.iconButton}>
                        <Image
                            source={require('../assets/icons/share.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                )}

                {showWishlist && (
                    <TouchableOpacity onPress={() => navigation.navigate('MyProduct')} style={styles.iconButton}>
                        <Image
                            source={require('../assets/icons/BaseLine-Heart.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                )}

                {showCart && (
                    <TouchableOpacity onPress={handleCart} style={styles.iconButton}>
                        <Image
                            source={require('../assets/icons/Buy1.png')}
                            style={styles.icon}
                        />
                        {cartBadgeCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{cartBadgeCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16, // More spacious
        backgroundColor: '#fff',
        marginTop: 20, // Adjust for status bar
        // Shadow for depth
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.05,
        // shadowRadius: 2,
        // elevation: 2,
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    titleContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 12, // Space between icons
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
    },
    iconButton: {
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        tintColor: '#000',
        // backgroundColor: 'red',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#637BDD',
        borderRadius: 10,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
