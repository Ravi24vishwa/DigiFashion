import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonHeader } from '../../../components/CommonHeader';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const EditProfile = ({ navigation }) => {
    const [profileData, setProfileData] = useState({
        fullName: 'Piyush Prajapati',
        phoneNumber: '9988556644',
        email: 'piyush@example.com',
        gender: 'Male',
        city: 'Surat',
        state: 'Gujarat',
        profileImage: require('../../../assets/images/ProfileImage.png')
    });

    const handleSave = () => {
        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack();
    };

    const InputField = ({ label, value, onChangeText, placeholder }) => (
        <View style={styles.inputWrapper}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <CommonHeader
                title="Edit Profile"
                showBack={true}
                onBackPress={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Profile Image Section */}
                    <View style={styles.imageSection}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={profileData.profileImage}
                                style={styles.profileImage}
                            />
                        </View>
                        <TouchableOpacity style={styles.changePictureBtn}>
                            <Text style={styles.changePictureText}>CHANGE PICTURE</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        <InputField
                            placeholder="Full Name*"
                            value={profileData.fullName}
                            onChangeText={(text) => setProfileData({ ...profileData, fullName: text })}
                        />
                        <InputField
                            placeholder="Phone Number*"
                            value={profileData.phoneNumber}
                            onChangeText={(text) => setProfileData({ ...profileData, phoneNumber: text })}
                        />
                        <InputField
                            placeholder="Email ID*"
                            value={profileData.email}
                            onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                        />
                        <InputField
                            placeholder="Gender"
                            value={profileData.gender}
                            onChangeText={(text) => setProfileData({ ...profileData, gender: text })}
                        />
                        <InputField
                            placeholder="City"
                            value={profileData.city}
                            onChangeText={(text) => setProfileData({ ...profileData, city: text })}
                        />
                        <InputField
                            placeholder="State"
                            value={profileData.state}
                            onChangeText={(text) => setProfileData({ ...profileData, state: text })}
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 30,
        alignItems: 'center',
    },
    imageSection: {
        alignItems: 'center',
        marginVertical: 30,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    changePictureBtn: {
        paddingVertical: 5,
    },
    changePictureText: {
        color: '#637BDD',
        fontWeight: '700',
        fontSize: 14,
    },
    formContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    inputWrapper: {
        width: '100%',
        height: 60,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 15,
        justifyContent: 'center',
        paddingHorizontal: 15,
        // Using a light shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    input: {
        fontSize: 16,
        color: '#000',
    },
    saveButton: {
        width: responsiveWidth(90),
        height: 55,
        backgroundColor: '#637BDD',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#637BDD',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
