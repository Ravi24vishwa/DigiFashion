import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import React, { useState, useRef, useMemo, useCallback } from 'react'
import { CommonHeader } from '../../../components/CommonHeader'
import { useCart } from '../../../contexts/CartContext'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { useTabBarVisibility } from '../../../contexts/TabBarVisibilityContext'
import { useDispatch } from 'react-redux'
import { logout } from '../../../store/slices/authSlice'

const ProfileScreen = ({ navigation }) => {
  const { cartItems } = useCart();
  const { setIsTabBarVisible } = useTabBarVisibility();
  const dispatch = useDispatch();

  // Bottom Sheet Ref
  const logoutSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['30%'], []);

  // Dynamic user data mock
  const [userData, setUserData] = useState({
    name: 'Piyush Prajapati',
    profileImage: require('../../../assets/images/ProfileImage.png')
  });

  const handleLogoutPress = () => {
    setIsTabBarVisible(false);
    logoutSheetRef.current?.expand();
  };

  const handleCloseLogout = () => {
    setIsTabBarVisible(false);
    logoutSheetRef.current?.close();
  };

  const confirmLogout = () => {
    logoutSheetRef.current?.close();
    setIsTabBarVisible(true);
    // Dispatch logout to clear token and user data
    // Root navigator (MainNavigation) will automatically switch to the Auth stack
    dispatch(logout());
  };

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const menuItems = [
    {
      id: 1,
      title: 'My Shared Products',
      icon: require('../../../assets/icons/share.png'),
      onPress: () => navigation.navigate('MyProduct', { tab: 'Shared' })
    },
    {
      id: 2,
      title: 'My Viewed Products',
      icon: require('../../../assets/icons/MyViewedProduct.png'),
      onPress: () => navigation.navigate('MyProduct', { tab: 'Viewed' })
    },
    {
      id: 3,
      title: 'Setting',
      icon: require('../../../assets/icons/Settings.png'),
      onPress: () => navigation.navigate('Settings')
    },
    {
      id: 4,
      title: 'Rate',
      icon: require('../../../assets/icons/Rate.png'),
      onPress: () => Alert.alert('Rate Us', 'Rating Coming Soon!')
    },
    {
      id: 5,
      title: 'Logout',
      icon: require('../../../assets/icons/Logout.png'),
      color: '#FF5252',
      onPress: handleLogoutPress
    },
  ];

  return (
    <View style={styles.container}>
      <CommonHeader
        title="Account"
        showBack={false}
        showSearch={true}
        showCart={true}
        onSearchPress={() => navigation.navigate('SearchBarScreen')}
        cartBadgeCount={cartItems?.length || 0}
      />

      <View style={styles.divider} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <TouchableOpacity
          style={styles.profileSection}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <View style={styles.imageWrapper}>
            <View style={styles.profileImageContainer}>
              <Image
                source={userData.profileImage}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.cameraBtn}>
              <Image
                source={require('../../../assets/icons/ProfileImageCamera.png')}
                style={styles.cameraIcon}
              />
            </View>
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Image
            source={require('../../../assets/icons/Back.png')}
            style={styles.chevronIcon}
          />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Help Centre */}
        <TouchableOpacity
          style={styles.helpSection}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('HelpCentre')}
        >
          <Text style={styles.helpText}>Help Centre</Text>
          <Image
            source={require('../../../assets/icons/Back.png')}
            style={styles.chevronIcon}
          />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.6}
            >
              <View style={styles.menuLeft}>
                <Image
                  source={item.icon}
                  style={[
                    styles.menuIcon,
                    item.color ? { tintColor: item.color } : { tintColor: '#4B5563' }
                  ]}
                />
                <Text style={[
                  styles.menuText,
                  item.color ? { color: item.color } : { color: '#000' }
                ]}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Logout Bottom Sheet */}
      <BottomSheet
        ref={logoutSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={() => setIsTabBarVisible(true)}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Logout</Text>
          <View style={styles.sheetDivider} />

          <Text style={styles.sheetMessage}>Are you sure you want to log out?</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCloseLogout}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={confirmLogout}
            >
              <Text style={styles.confirmBtnText}>Yes, Log Out</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5B6BEE',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cameraIcon: {
    width: 16,
    height: 16,
    tintColor: '#fff',
    resizeMode: 'contain'
  },
  userName: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    marginLeft: 20,
  },
  chevronIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
    transform: [{ rotate: '180deg' }],
    opacity: 0.8,
  },
  divider: {
    height: 8,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  helpSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#fff',
  },
  helpText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  menuContainer: {
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  menuLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  menuText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 22,
  },
  sheetContent: {
    padding: 24,
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF5252',
    marginBottom: 15,
  },
  sheetDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 25,
  },
  sheetMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 35,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 15,
  },
  cancelBtn: {
    flex: 1,
    height: 55,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#637BDD',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#637BDD',
  },
  confirmBtn: {
    flex: 1,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#637BDD',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#637BDD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  confirmBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
})

export default ProfileScreen