import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { CommonHeader } from '../../../components/CommonHeader';
import { useCart } from '../../../contexts/CartContext';
import { useTabBarVisibility } from '../../../contexts/TabBarVisibilityContext';

// Extracted Components
import CartStepper from '../../../components/Cart/CartStepper';
import SizeModal from '../../../components/Cart/SizeModal';
import CartItem from '../../../components/Cart/CartItem';
import PriceDetails from '../../../components/Cart/PriceDetails';
import CartFooter from '../../../components/Cart/CartFooter';
import AddressStep from '../../../components/Cart/AddressStep';
import PaymentStep from '../../../components/Cart/PaymentStep';
import SuccessStep from '../../../components/Cart/SuccessStep';
import EmptyCart from '../../../components/Cart/EmptyCart';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, updateQuantity, updateCartItem, calculateTotal, clearCart } = useCart();
  const { setIsTabBarVisible } = useTabBarVisibility();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Size Modal State
  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    flatNo: '',
    landmark: '',
    pincode: '',
    state: '',
    city: '',
    name: '',
    phone: ''
  });

  // Payment State
  const [selectedPayment, setSelectedPayment] = useState('Razorpay');

  const paymentGateways = [
    { id: 'Razorpay', name: 'Razorpay', image: require('../../../assets/icons/RazorPay.png') },
    { id: 'PayU', name: 'PayU', image: require('../../../assets/icons/PayU.png') },
    { id: 'Instamojo', name: 'Instamojo', image: require('../../../assets/icons/Instamojo.png') },
    { id: 'PayPal', name: 'PayPal', image: require('../../../assets/icons/PayPal.png') },
  ];

  useEffect(() => {
    if (cartItems && cartItems.length === 1) {
      setSelectedItemId(cartItems[0].id);
    }
  }, [cartItems]);

  const handleSizeSelect = (size) => {
    if (editingItem) {
      updateCartItem(editingItem.id, { size });
    }
    setSizeModalVisible(false);
    setEditingItem(null);
  };

  const onOpenSizeModal = (item) => {
    setEditingItem(item);
    setSizeModalVisible(true);
  };

  useEffect(() => {
    // Hide Bottom Tab Bar on Step 3 (Payment) and Step 4 (Success)
    if (currentStep >= 3) {
      setIsTabBarVisible(false);
    } else {
      setIsTabBarVisible(true);
    }

    // Cleanup: Ensure Tab Bar is visible when leaving CartScreen
    return () => setIsTabBarVisible(true);
  }, [currentStep, setIsTabBarVisible]);

  const handleContinueShopping = () => {
    // If you have a clear cart function in context, call it here
    if (clearCart) clearCart();
    navigation.navigate('HomeTab'); // Adjust to your actual Main/Home route name
  };

  const handlePlaceOrder = () => {
    setCurrentStep(4);
  };

  const total = calculateTotal();

  if (currentStep === 4) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <SuccessStep onContinueShopping={handleContinueShopping} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <CommonHeader
        title={currentStep === 1 ? "Cart" : currentStep === 2 ? "Delivery Address" : "Payment Method"}
        showBack={currentStep > 1}
        onBackPress={() => setCurrentStep(currentStep - 1)}
        showSearch={false}
        showCart={false}
        showWishlist={false}
        onSearchPress={() => navigation.navigate('SearchBarScreen')}
      />

      {cartItems.length > 0 && <CartStepper currentStep={currentStep} />}

      <SizeModal
        visible={sizeModalVisible}
        onClose={() => setSizeModalVisible(false)}
        sizes={sizes}
        selectedSize={editingItem?.size}
        onSelect={handleSizeSelect}
      />

      {currentStep === 1 && (
        <View style={{ flex: 1 }}>
          {cartItems.length > 0 ? (
            <FlatList
              data={cartItems}
              renderItem={({ item }) => (
                <CartItem
                  item={item}
                  updateQuantity={updateQuantity}
                  onOpenSizeModal={onOpenSizeModal}
                  onRemove={removeFromCart}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              ListFooterComponent={() => (
                <View>
                  <PriceDetails
                    cartItemsCount={cartItems.length}
                    totalProductPrice={total}
                  />
                  {cartItems.length > 1 && (
                    <CartFooter
                      total={total}
                      onPress={() => setCurrentStep(2)}
                    />
                  )}
                  <View style={{ height: 100 }} />
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <EmptyCart onViewProduct={() => navigation.navigate('HomeTab')} />
          )}
          {cartItems.length === 1 && (
            <CartFooter
              total={total}
              onPress={() => setCurrentStep(2)}
            />
          )}
        </View>
      )}

      {currentStep === 2 && (
        <AddressStep
          addressForm={addressForm}
          setAddressForm={setAddressForm}
          onSaveAndContinue={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 3 && (
        <View style={{ flex: 1 }}>
          <PaymentStep
            paymentGateways={paymentGateways}
            selectedPayment={selectedPayment}
            onSelectPayment={setSelectedPayment}
            cartItemsCount={cartItems.length}
            totalProductPrice={total}
          />
          <CartFooter
            total={total}
            label="Place Order"
            onPress={handlePlaceOrder}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
});
