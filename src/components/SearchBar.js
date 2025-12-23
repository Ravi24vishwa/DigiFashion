import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const SearchBar = ({
  mode = "full",
  placeholder = "Search...",
  value,
  onChangeText,
  onIconPress,
  containerStyle,
  iconImage,
  autoFocus = false,
}) => {
  return (
    <View style={[
      styles.container,
      mode === 'full' && styles.fullContainer,
      containerStyle
    ]}>
      <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
        <Image
          source={iconImage || require('../assets/icons/search.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
  },
  fullContainer: {
    backgroundColor: '#F2F2F2',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
    tintColor: '#444',
  },
  input: {
    flex: 1,
    fontSize: RFValue(12),
    color: '#000',
    paddingVertical: 0,
  },
});

export default SearchBar;
