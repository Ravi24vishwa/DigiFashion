import React, { useRef } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import CarouselBanner from "./CarouselBanner";
import { bannerData } from "./bannerData";
import { useSharedValue } from 'react-native-reanimated';
import { interpolate, Extrapolation } from 'react-native-reanimated';

const { width } = Dimensions.get("window");

const BannerCarousel = () => {
  const progress = useSharedValue(0);
  const ref = useRef(null);

  const onPressPagination = (index) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View style={styles.wrapper}>
      <Carousel
        ref={ref}
        width={width}
        height={220}
        data={bannerData}
        loop
        autoPlay
        autoPlayInterval={5000}
        snapEnabled
        pagingEnabled
        onProgressChange={progress}
        renderItem={({ item, index }) => (
          <CarouselBanner item={item} />
        )}
      />

      {/* Pagination outside carousel - stays in middle */}
      <View style={styles.paginationContainer}>
        <Pagination.Custom
          progress={progress}
          data={bannerData}
          size={20}
          dotStyle={{
            borderRadius: 16,
            backgroundColor: "rgba(143, 143, 143, 0.5)",
            width: 8,
            height: 8,
          }}
          activeDotStyle={{
            borderRadius: 16,
            width: 24,
            height: 8,
            overflow: "hidden",
            backgroundColor: "#637BDD",
          }}
          containerStyle={{
            gap: 6,
            alignItems: "center",
            height: 8,
          }}
          horizontal
          onPress={onPressPagination}
          customReanimatedStyle={(progress, index, length) => {
            let val = Math.abs(progress - index);
            if (index === 0 && progress > length - 1) {
              val = Math.abs(progress - length);
            }

            return {
              width: interpolate(
                val,
                [0, 1],
                [24, 8],
                Extrapolation.CLAMP
              ),
              opacity: interpolate(
                val,
                [0, 1],
                [1, 0.5],
                Extrapolation.CLAMP
              ),
              transform: [
                {
                  scale: interpolate(
                    val,
                    [0, 1],
                    [1, 0.8],
                    Extrapolation.CLAMP
                  ),
                },
              ],
            };
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    width: width,
    height: 220,
    // backgroundColor: 'red'
  },
  paginationContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.25)",
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    width: "auto",
  }
});

export default BannerCarousel;