import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { responsiveHeight } from 'react-native-responsive-dimensions'

const PromoBanner = ({imageUrl}) => {
  return (
   <View style={{
        flex: 1,
        // width: '100%',
        marginHorizontal: 1,
        marginTop: 5,
        borderRadius: 20,
        padding: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red'
      }}>
       <Image 
       source={imageUrl}
       style={{flex: 1,
        marginHorizontal: 5,
        borderRadius: 20,
        height: responsiveHeight(25),
        resizeMode: 'contain'
       }}
       />
      </View>  
  )
}

export default PromoBanner

const styles = StyleSheet.create({})