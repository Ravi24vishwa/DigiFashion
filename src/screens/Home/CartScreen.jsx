import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { CommonHeader } from '../../components/layout/CommonHeader';
import { useCart, useAppUI, useCheckout } from '../../hooks';

// Extracted Components
import CartStepper from '../../components/features/cart/CartStepper';
import SizeModal from '../../components/features/cart/SizeModal';
import CartItem from '../../components/features/cart/CartItem';
import PriceDetails from '../../components/features/cart/PriceDetails';
import CartFooter from '../../components/features/cart/CartFooter';
import AddressStep from '../../components/features/cart/AddressStep';
import PaymentStep from '../../components/features/cart/PaymentStep';
import SuccessStep from '../../components/features/cart/SuccessStep';
import EmptyCart from '../../components/features/cart/EmptyCart';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, updateQuantity, refreshCart, calculateTotal, clearCart } = useCart();
  const { setIsTabBarVisible } = useAppUI();
  const {
    addresses,
    states,
    isLoading: isCheckoutLoading,
    fetchAddresses,
    fetchStates,
    selectedAddressId,
    applyAddress,
    submitOrder
  } = useCheckout();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

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
    { id: 'Razorpay', name: 'Razorpay', image: require('../../assets/icons/RazorPay.png') },
    { id: 'PayU', name: 'PayU', image: require('../../assets/icons/PayU.png') },
    { id: 'Instamojo', name: 'Instamojo', image: require('../../assets/icons/Instamojo.png') },
    { id: 'PayPal', name: 'PayPal', image: require('../../assets/icons/PayPal.png') },
  ];

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setSelectedItemId(cartItems[0].cart_item_id || cartItems[0].id);
    }
    console.log('cart data============>', cartItems)
  }, [cartItems]);


  const handleSizeSelect = (size) => {
    // API doesn't support size update directly currently
    setSizeModalVisible(false);
    setEditingItem(null);
  };

  const onOpenSizeModal = (item) => {
    // Disable size modal for now as API doesn't support size update
    // setEditingItem(item);
    // setSizeModalVisible(true);
  };


  useEffect(() => {
    if (currentStep === 2) {
      fetchAddresses();
      fetchStates();
    }
  }, [currentStep, fetchAddresses, fetchStates]);

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
    setCurrentStep(1); // Reset internal state
    navigation.navigate('HomeTab');
  };

  const handlePlaceOrder = async () => {
    try {
      // Prepare order data as per API
      const orderData = {
        delivery_type: 'delivery', // Or from state if we add selection
        store_id: cartItems[0]?.shop_id || 1, // Defaulting to first item's shop
      };

      const res = await submitOrder(orderData);
      if (res) {
        clearCart();
        setCurrentStep(4);
      }
    } catch (error) {
      console.error('Order Submission Error:', error);
    }
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
              keyExtractor={(item) => (item.cart_item_id || item.id || Math.random().toString()).toString()}

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
          addresses={addresses}
          states={states}
          selectedAddressId={selectedAddressId}
          onSelectAddress={applyAddress}
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
