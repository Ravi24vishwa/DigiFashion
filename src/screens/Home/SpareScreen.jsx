import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

import SearchBar from "../../components/SearchBar";

export const PRODUCTS = [
  {
    id: 1,
    name: "iPhone 14",
    category: "Mobile",
    brand: "Apple",
    price: 79999,
  },
  {
    id: 2,
    name: "Galaxy S23",
    category: "Mobile",
    brand: "Samsung",
    price: 74999,
  },
  {
    id: 3,
    name: "MacBook Air M1",
    category: "Laptop",
    brand: "Apple",
    price: 99999,
  },
  {
    id: 4,
    name: "Dell Inspiron",
    category: "Laptop",
    brand: "Dell",
    price: 55999,
  },
  {
    id: 5,
    name: "Sony Headphones",
    category: "Accessories",
    brand: "Sony",
    price: 8999,
  },
];


const SpareScreen = () => {
  const [query, setQuery] = useState("");

  // 🔍 FILTER LOGIC
  const filteredData = PRODUCTS.filter((item) => {
    const searchText = query.toLowerCase();

    return (
      item.name.toLowerCase().includes(searchText) ||
      item.brand.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText)
    );
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.brand} • {item.category}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No results found</Text>
        }
      />
    </View>
  );
};

export default SpareScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 55
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 6,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    marginTop: 5,
    color: "green",
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "gray",
  },
});
