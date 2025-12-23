export const ordersData = [
    {
        id: '650668538456',
        title: 'Evening Dress',
        price: 500.00,
        size: 'XXL',
        qty: 1,
        soldTo: 'Kamlesh',
        status: 'Ordered',
        image: require('../assets/images/HomeScreenImages/Dress1.png'), // Using existing asset
    },
    {
        id: '650668538457',
        title: 'Pink T-shirt',
        price: 199.00,
        size: 'M',
        qty: 1,
        soldTo: 'Kamlesh',
        status: 'Shipped',
        image: require('../assets/images/HomeScreenImages/Dress2.png'),
    },
    {
        id: '650668538458',
        title: 'Blue Shirt',
        price: 299.00,
        size: 'L',
        qty: 2,
        soldTo: 'Kamlesh',
        status: 'Delivered',
        image: require('../assets/images/HomeScreenImages/Dress2.png'),
    },
    {
        id: '650668538459',
        title: 'Leather Belt',
        price: 199.00,
        size: 'M',
        qty: 1,
        soldTo: 'Kamlesh',
        status: 'Cancelled',
        image: require('../assets/images/HomeScreenImages/Dress2.png'),
    }
];

export const filterOptions = [
    'All', 'Ordered', 'Shipped', 'Delivered', 'Cancelled', 'Exchange', 'Return'
];
