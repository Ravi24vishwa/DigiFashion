import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useMemo, useState, useEffect } from "react";
import SearchBar from "../../components/common/SearchBar";
import { useNavigation } from "@react-navigation/native";
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { productService } from '../../api/productService';
import { ActivityIndicator } from 'react-native';

const SearchBarScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const res = await productService.getProducts({ search: query });
        const mappedData = (res.Data || []).map(p => ({
          ...p,
          id: p.id || p.product_id || Math.random().toString(),
          title: p.name || p.product_name || 'Unnamed Product',
          price: parseFloat(p.product_price || 0),
          image: p.product_thumbnail_image_url || p.product_image_url,
          category: p.categorie_name || '',
          slug: p.slug || p.product_slug
        }));
        setResults(mappedData);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      searchProducts();
    }, 500);

    return () => clearTimeout(timer);
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

      {isLoading && (
        <View style={{ padding: 20 }}>
          <ActivityIndicator color="#637BDD" />
        </View>
      )}

      {/* Search Results */}
      <FlatList
        data={results}
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
            onPress={() => navigation.navigate("ProductDetailScreen", { slug: item.slug })}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={typeof item.image === 'string' ? { uri: item.image } : (item.image || require("../../assets/icons/Show.png"))}
                style={{ width: responsiveWidth(15), height: responsiveWidth(15), borderRadius: 10 }}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 16, color: "#000" }}>{item.title}</Text>
                <Text style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
                  {item.category} {item.gender ? `| ${item.gender}` : ""}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          query.trim().length >= 2 && !isLoading ? (
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
