import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonHeader } from '../../../components/CommonHeader';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const HelpCentre = ({ navigation, route }) => {
    const [selectedIssue, setSelectedIssue] = useState(null);

    // We can pass order data from previous screen or use dummy
    const order = route.params?.order || {
        id: '650668538456',
        soldTo: 'Kamlesh',
        title: 'Evening Dress',
        price: 500.00,
        status: 'Order Placed',
        image: require('../../../assets/images/HomeScreenImages/Dress1.png')
    };

    const issues = [
        "Can I raise a return/exchange request?",
        "Where is my order?"
    ];

    const handleBack = () => {
        if (selectedIssue) {
            setSelectedIssue(null);
        } else {
            navigation.goBack();
        }
    };

    const IssueItem = ({ title, onPress }) => (
        <TouchableOpacity style={styles.issueItem} onPress={onPress}>
            <Text style={styles.issueText}>{title}</Text>
            <Image
                source={require('../../../assets/icons/Back.png')}
                style={styles.chevronIcon}
            />
        </TouchableOpacity>
    );

    const ContactItem = ({ icon, title, subtext }) => (
        <TouchableOpacity style={styles.contactItem} activeOpacity={0.7}>
            <Image source={icon} style={styles.contactIcon} />
            <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{title}</Text>
                <Text style={styles.contactSubtext}>{subtext}</Text>
            </View>
            <Image
                source={require('../../../assets/icons/Back.png')}
                style={styles.chevronIcon}
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <CommonHeader
                title="Help Centre"
                showBack={true}
                onBackPress={handleBack}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                {!selectedIssue ? (
                    <>
                        {/* Order Summary Card Section */}
                        <View style={styles.orderCardWrapper}>
                            <View style={styles.orderCard}>
                                <View style={styles.orderCardHeader}>
                                    <Text style={styles.orderIdText}>Order ID {order.id}</Text>
                                    <Text style={styles.soldToText}>Sold to <Text style={{ fontWeight: '700', color: '#000' }}>{order.soldTo}</Text></Text>
                                </View>

                                <View style={styles.productRow}>
                                    <Image source={order.image} style={styles.productImage} />
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productTitle}>{order.title}</Text>
                                        <Text style={styles.productPrice}>₹{order.price.toFixed(2)}</Text>
                                        <View style={styles.statusRow}>
                                            <View style={styles.statusDot} />
                                            <Text style={styles.statusText}>{order.status}</Text>
                                        </View>
                                    </View>
                                    <Image
                                        source={require('../../../assets/icons/Back.png')}
                                        style={styles.chevronIcon}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* <View style={styles.divider} /> */}

                        {/* Issues Section */}
                        <View style={styles.issuesContainer}>
                            <Text style={styles.sectionTitle}>What issue are you facing?</Text>

                            <View style={styles.listContainer}>
                                {issues.map((issue, index) => (
                                    <React.Fragment key={index}>
                                        <IssueItem
                                            title={issue}
                                            onPress={() => setSelectedIssue(issue)}
                                        />
                                        <View style={styles.itemSeparator} />
                                    </React.Fragment>
                                ))}
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={styles.detailContainer}>
                        <View style={styles.detailTextSection}>
                            <Text style={styles.detailIssueTitle}>{selectedIssue}</Text>
                            <Text style={styles.greetingText}>Hi Piyush,</Text>
                            <Text style={styles.descriptionText}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.stillNeedHelpSection}>
                            <Text style={styles.stillNeedHelpTitle}>Still need help?</Text>

                            <ContactItem
                                icon={require('../../../assets/icons/chat.png')} // Best guess for a message icon
                                title="Chat with us"
                                subtext="Get faster response to all your queries"
                            />
                            <View style={styles.itemSeparator} />
                            <ContactItem
                                icon={require('../../../assets/icons/Call.png')}
                                title="Call me back"
                                subtext="You will get a call back within 5 mins"
                            />
                            <View style={styles.itemSeparator} />
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default HelpCentre;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    orderCardWrapper: {
        padding: 20,
        backgroundColor: '#fff',
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    orderIdText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    soldToText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    productInfo: {
        flex: 1,
        marginLeft: 15,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: '#000',
        marginBottom: 4,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#637BDD',
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    chevronIcon: {
        width: 18,
        height: 18,
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
    issuesContainer: {
        backgroundColor: '#fff',
        paddingTop: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#000',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    listContainer: {
        width: '100%',
    },
    issueItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    issueText: {
        fontSize: 16,
        color: '#4B5563',
        fontWeight: '500',
        flex: 1,
        marginRight: 10,
    },
    itemSeparator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 0,
    },
    detailContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    detailTextSection: {
        padding: 20,
        paddingTop: 30,
    },
    detailIssueTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#333',
        lineHeight: 28,
        marginBottom: 15,
    },
    greetingText: {
        fontSize: 20,
        fontWeight: '800',
        color: '#333',
        marginBottom: 15,
    },
    descriptionText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        textAlign: 'justify',
    },
    stillNeedHelpSection: {
        paddingTop: 25,
        backgroundColor: '#fff',
    },
    stillNeedHelpTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#333',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    contactIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        tintColor: '#4B5563',
    },
    contactInfo: {
        flex: 1,
        marginLeft: 15,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 2,
    },
    contactSubtext: {
        fontSize: 12,
        color: '#9CA3AF',
    }
});
