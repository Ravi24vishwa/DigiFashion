import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Alert } from 'react-native';

// Try to require AsyncStorage at runtime. If it's not installed, provide
// a lightweight in-memory fallback so Metro bundler doesn't fail and the
// app continues to work in development until the package is installed.
let AsyncStorage;
try {
    // Use require so Metro doesn't fail the bundle if package is missing
    // (static import would fail at bundle time).
    // The `.default` is needed because the package exports a default.
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
    console.warn('@react-native-async-storage/async-storage not found — using in-memory fallback. Install the package to persist data across restarts.');
    const _memStore = {};
    AsyncStorage = {
        getItem: async (key) => (_memStore.hasOwnProperty(key) ? _memStore[key] : null),
        setItem: async (key, value) => { _memStore[key] = value; },
        removeItem: async (key) => { delete _memStore[key]; }
    };
}
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

export const RateReviewSheet = ({
    bottomSheetRef,
    snapPoints = ['75%'],
    product,
    onSubmitReview,
    onClose,
    setIsTabBarVisible,
    showMedia = true
}) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [mediaItems, setMediaItems] = useState([]); // Array to store photos/videos

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            if (setIsTabBarVisible) setIsTabBarVisible(true);
            if (onClose) onClose();
        } else {
            if (setIsTabBarVisible) setIsTabBarVisible(false);
        }
    }, [setIsTabBarVisible, onClose]);

    const handleStarPress = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleAddMedia = () => {
        // Try to open native image picker if available, otherwise fallback to placeholder
        try {
            // require at runtime so app doesn't crash if package missing
            const ImagePicker = require('react-native-image-picker');
            const options = { mediaType: 'photo', quality: 0.8, selectionLimit: 5 };
            ImagePicker.launchImageLibrary(options, (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    console.warn('ImagePicker error', response.errorMessage || response.errorCode);
                    Alert.alert('Error', 'Unable to pick image');
                    return;
                }
                const asset = response.assets && response.assets[0];
                if (asset && asset.uri) {
                    const newMedia = { id: Date.now(), type: 'image', uri: asset.uri };
                    const next = [...mediaItems, newMedia];
                    setMediaItems(next);
                    // persist to AsyncStorage
                    persistMedia(next);
                }
            });
        } catch (e) {
            // Fallback placeholder (useful for dev without image-picker)
            const newMedia = { id: Date.now(), type: 'image', uri: 'https://via.placeholder.com/150' };
            const next = [...mediaItems, newMedia];
            setMediaItems(next);
            persistMedia(next);
        }
    };

    const persistMedia = async (items) => {
        try {
            const key = `review_media_${product?.id || 'global'}`;
            await AsyncStorage.setItem(key, JSON.stringify(items));
        } catch (err) {
            console.warn('Failed to persist media', err);
        }
    };

    const handleSubmit = () => {
        if (onSubmitReview) {
            onSubmitReview({
                rating,
                reviewText,
                mediaItems
            });
            setReviewText('');
            setRating(0);
            setMediaItems([]);
        }
        // persist review locally
        persistReview({ rating, reviewText, mediaItems });
        bottomSheetRef.current?.close();
    };

    const persistReview = async (review) => {
        try {
            const key = `reviews_${product?.id || 'global'}`;
            const existing = await AsyncStorage.getItem(key);
            const parsed = existing ? JSON.parse(existing) : [];
            parsed.unshift({ ...review, date: new Date().toISOString(), id: Date.now() });
            await AsyncStorage.setItem(key, JSON.stringify(parsed));
        } catch (err) {
            console.warn('Failed to persist review', err);
        }
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
            onChange={handleSheetChanges}
            keyboardBlurBehavior="restore"
        >
            <BottomSheetView style={styles.contentContainer}>

                <View style={styles.header}>
                    <View style={styles.handleBar} />
                </View>

                <Text style={styles.title}>What is you rate?</Text>

                {/* Star Rating */}
                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                            <Image
                                source={rating >= star
                                    ? require('../assets/icons/Star.png')
                                    : require('../assets/icons/Star1.png')} // Assuming Star.png is filled, Star1.png is outline/empty
                                style={styles.starIcon}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.subtitle}>{"Please share your opinion \n about the product"}</Text>

                {/* Review Text Input */}
                <BottomSheetTextInput
                    style={styles.input}
                    placeholder="Your Review"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    value={reviewText}
                    onChangeText={setReviewText}
                />

                {/* Media Section */}
                {showMedia && (
                    <View style={styles.mediaSection}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaScroll}>
                            {mediaItems.map((item, index) => (
                                <View key={item.id} style={styles.mediaItem}>
                                    <Image source={{ uri: item.uri }} style={styles.mediaImage} />
                                    {item.type === 'video' && (
                                        <View style={styles.playIconContainer}>
                                            <View style={styles.playIcon} />
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        style={styles.removeMedia}
                                        onPress={() => setMediaItems(mediaItems.filter(m => m.id !== item.id))}
                                    >
                                        <Text style={styles.removeText}>×</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}

                            <TouchableOpacity style={styles.addMediaButton} onPress={handleAddMedia}>
                                <View style={styles.cameraIconContainer}>
                                    <Image
                                        source={require('../assets/icons/Camera.png')} // Make sure this icon exists or use a fallback
                                        style={styles.cameraIcon}
                                    />
                                </View>
                                <Text style={styles.addMediaText}>Add your photos</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                )}

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>SEND REVIEW</Text>
                </TouchableOpacity>

            </BottomSheetView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    bottomSheetBackground: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    handleIndicator: {
        backgroundColor: '#E5E7EB',
        width: 40,
        marginTop: 10,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
        paddingTop: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 20,
        marginBottom: 20,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 30,
    },
    starIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        // tintColor: '#F59E0B', // Amber color for stars
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 20,
        textAlign: 'center',
        width: '80%',
    },
    input: {
        width: '100%',
        height: 120,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2, // For Android
    },
    mediaSection: {
        width: '100%',
        marginBottom: 30,
    },
    mediaScroll: {
        alignItems: 'center',
        gap: 16,
    },
    mediaItem: {
        width: 80,
        height: 80,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    mediaImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F3F4F6',
    },
    playIconContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    playIcon: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 0,
        borderBottomWidth: 7,
        borderTopWidth: 7,
        borderLeftColor: 'white',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    removeMedia: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        lineHeight: 14,
    },
    addMediaButton: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    cameraIconContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#6366F1',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    cameraIcon: {
        width: 24,
        height: 24,
        tintColor: 'white',
        resizeMode: 'contain',
    },
    addMediaText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937',
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#6366F1',
        borderRadius: 30,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 'auto', // Push to bottom if space allows
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
