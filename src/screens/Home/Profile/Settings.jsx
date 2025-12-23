import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CommonHeader } from '../../../components/CommonHeader'
import { Switch } from 'react-native'
const Settings = ({ navigation }) => {
    const [showStockOnly, setShowStockOnly] = useState(false);
    // const displayedProducts = showStockOnly
    //     ? tabProducts.filter(item => item.stock === 'In Stock')
    //     : tabProducts;

    return (
        <SafeAreaView>
            <CommonHeader
                title="Settings"
                showBack={true}
                showSearch={false}
                showCart={false}
                onBackPress={() => navigation.goBack()}
                style={{
                    backgroundColor: '#fff',
                }}
            />
            <View style={styles.divider} />
            <View style={styles.Container}>
                <Text style={styles.stockToggleTitle}>Share Settings</Text>
                <View style={styles.stockToggleContainer}>
                    <Text style={styles.stockToggleText}>Include text as image while sharing</Text>
                    <Switch
                        trackColor={{ false: "#898989", true: "#6366F1" }}
                        thumbColor="#fff"
                        ios_backgroundColor="#898989"
                        onValueChange={() => setShowStockOnly(!showStockOnly)}
                        value={showStockOnly}
                    />
                </View>
            </View>
            <View style={styles.divider} />
        </SafeAreaView>
    )
}

export default Settings

const styles = StyleSheet.create({
    divider: {
        height: 8,
        backgroundColor: '#E5E7EB',
    },
    Container: {
        backgroundColor: '#fff',
    },
    stockToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    stockToggleTitle: {
        fontSize: 22,
        color: '#333',
        fontWeight: '600',
        marginLeft: 16,
        marginTop: 16,
    },
    stockToggleText: {
        fontSize: 16,
        color: '#333',
    },
})