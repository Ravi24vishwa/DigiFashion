import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";

const CustomSocialButton = ({
  width,
  height,
  backgroundColor,
  title,
  icon,
  textColor,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          width,
          height,
          backgroundColor,
        },
        styles.btnContainer,
        style,
      ]}
      onPress={onPress}
    >
      {icon && <Image source={icon} style={styles.icon} />}
      <Text style={[styles.btnText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomSocialButton;

const styles = StyleSheet.create({
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
  },
  icon: {
    width: RFValue(20),
    height: RFValue(20),
    resizeMode: "contain",
    marginRight: RFValue(8),
  },
  btnText: {
    fontSize: RFValue(18),
    fontWeight: "500",
  },
});
