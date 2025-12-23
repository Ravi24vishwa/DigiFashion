import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useMemo, useState } from "react";
import SearchBar from "../../components/SearchBar";
import { useNavigation } from "@react-navigation/native";
import { saleItems } from "../../data/productdata";

const SearchBarScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    if (query.trim() === "") return [];

    return saleItems.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(query.toLowerCase())) ||
      (item.gender && item.gender.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", marginTop: 40 }}>
      {/* Header with SearchBar */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#fff"
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
          <Image
            source={require("../../assets/icons/Back.png")}
            style={{ width: 20, height: 20, tintColor: "#000" }}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <SearchBar
            placeholder="Search for products, brands and more...."
            value={query}
            onChangeText={(text) => setQuery(text)}
            autoFocus={true}
          />
        </View>
      </View>

      {/* Search Results */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#eee"
            }}
            onPress={() => navigation.navigate("ProductDetailScreen", item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, color: "#000" }}>{item.title}</Text>
              <Text style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
                {item.category} {item.gender ? `| ${item.gender}` : ""}
              </Text>
            </View>
            <Image
              source={require("../../assets/icons/Line.png")}
              style={{ width: 14, height: 14, tintColor: "#ccc" }}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          query.trim() !== "" ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: "#666" }}>No results found for "{query}"</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default SearchBarScreen;
const styles = StyleSheet.create({
  imageStyles: {
    height: 59,
    width: 55,
    borderRadius: 7
  }
});
