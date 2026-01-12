import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

const CarouselBanner = ({ item }) => {
  return (
    <View style={[styles.container, { backgroundColor: item.bg }]}>
      {/* Right Image */}
      <View style={styles.imageContainer}>
        <Image source={{
          uri: item.image_url
        }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default CarouselBanner;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 210,
    borderRadius: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    padding: 5
    // marginLeft: responsiveWidth(2)
    // backgroundColor: 'red'
  },
  textContainer: {
    width: "55%",
    justifyContent: "center",
    gap: 8,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
  },
  title: {
    fontSize: 18,
    color: "#000",
  },
  button: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "contain"
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
});
