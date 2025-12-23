import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

const CarouselBanner = ({ item }) => {
  return (
    <View style={[styles.container, { backgroundColor: item.bg }]}>
      
      {/* Left Text Block */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>

        <TouchableOpacity>
          <Text style={styles.button}>Shop Now →</Text>
          {/* <Text style={styles.button}>Shop Now <Image source={require('../assets/icons/Arrow1.png')} /></Text> */}
        </TouchableOpacity>
      </View>

      {/* Right Image */}
      <View style={styles.imageContainer}>
      <Image source={item.image}  />
      </View>
    </View>
  );
};

export default CarouselBanner;

const styles = StyleSheet.create({
  container: {
    width: "95%",
    height: 210,
    borderRadius: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    elevation: 6,
    marginLeft: responsiveWidth(2)
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
    width: "35%",
    height: "100%",
    // backgroundColor: 'red',
    marginTop: responsiveHeight(4.8)
  },
});
