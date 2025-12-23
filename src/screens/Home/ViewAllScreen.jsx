import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { useRoute } from '@react-navigation/native';
import ProductGrid from '../../CommonHelper/ProductGrid';
import { useFavorites } from '../../contexts/FavoritesContext';
// import  CustomProductList  from '../../CommonHelper/CustomProductList';
// import {saleItems, TopItems, newItems} from '../../data/productdata'

const ViewAllScreen = ({ navigation }) => {

  const routes = useRoute();

  const seasonalProductList = routes.params

  console.log(seasonalProductList);


  const [ProductData, setProductData] = useState(seasonalProductList)
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleFavoritePress = (item) => {
    toggleFavorite(item);
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 10
      }}>
        <Text style={{ fontSize: 44 }}>
          Digi<Text style={{ fontWeight: 'bold' }}>FASHION</Text>
        </Text>
        <TouchableOpacity style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: '#F0F0F0',
          justifyContent: 'center',
          alignItems: 'center'
        }}
          onPress={() => navigation.navigate('MyProduct')}
        >
          <Image
            source={require('../../assets/icons/Heart1.png')}
            style={{ height: 22, width: 22, resizeMode: 'contain' }}
          ></Image>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <TouchableOpacity style={{
          marginHorizontal: 20,
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F6F6F6',
          borderRadius: 12,
          paddingHorizontal: 16,
          height: 50
        }}
          onPress={() => (navigation.navigate("SearchBarScreen"))}
        >
          {/* SearchBar */}
          <Image
            source={require('../../assets/icons/search1.png')}
          />
          <Text style={{ color: '#999', marginLeft: responsiveWidth(1.5) }}>What are you looking for...</Text>
        </TouchableOpacity>
      </ScrollView>
      <ProductGrid
        products={ProductData.map(item => ({
          ...item,
          isFavorite: isFavorite(item.id)
        }))}
        horizontal={false}
        numColumns={2}
        cardWidth={"47%"}
        imageHeight={200}
        showOldPrice
        showDiscount
        showFavorite
        onProductPress={(item) => navigation.navigate('ProductDetailScreen', item)}
        onFavoritePress={handleFavoritePress}
      />
    </View>
  )
}

export default ViewAllScreen

const styles = StyleSheet.create({})