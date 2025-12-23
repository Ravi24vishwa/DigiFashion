// Dummy data for different categories

  // export const products = [
  //   {
  //     id: '1',
  //     name: 'Evening Dress',
  //     price: 500.00,
  //     oldPrice: 700.00,
  //     discount: '20%',
  //     image: require('../assets/images/categories/cloth/cloth.png'),
  //     isSale: true,
  //     isFavorite: false,
  //   },
  //   {
  //     id: '2',
  //     name: 'Sport Dress',
  //     price: 500.00,
  //     oldPrice: 600.00,
  //     image: require('../assets/images/categories/cloth/cloth2.png'),
  //     isSale: false,
  //     isFavorite: false,      
  //   },
  //   {
  //     id: '3',
  //     name: 'Blazer',
  //     price: 500.00,
  //     oldPrice: 700.00,
  //     discount: '30%',
  //     image: require('../assets/images/categories/cloth/cloth3.png'),
  //     isSale: true,
  //     isFavorite: false,
  //   },
  //   {
  //     id: '4',
  //     name: 'T-Shirt Selling',
  //     price: 500.00,
  //     oldPrice: 600.00,
  //     image: require('../assets/images/categories/cloth/cloth4.png'),
  //     isSale: false,
  //     isFavorite: false,
  //   },
  // ];
  export const products = [
  {
    id: 1,
    title: 'Evening Dress',
    price: 400.00,
    oldPrice: 1000.00,
    discount: '-70%',
    rating: 4,
    reviewCount: 19,
    imageBgColor: '#C48B9F',
    isFavorite: false,
    image: require('../assets/images/HomeScreenImages/Dress1.png'),

    // 🔽 Added fields for filters
    category: 'Women',
    gender: 'Female',
    fabric: 'Chiffon',
    size: ['S', 'M'],
    color: 'Pink',
    isDiscounted: true,
    combo: false,
    stock: 'In Stock'
  },
  {
    id: 2,
    title: 'Sport Dress',
    price: 480.00,
    oldPrice: 600.00,
    discount: '-20%',
    rating: 5,
    reviewCount: 10,
    imageBgColor: '#A8B8C7',
    isFavorite: false,
    image: require('../assets/images/HomeScreenImages/Dress2.png'),

    // 🔽 Added fields
    category: 'Women',
    gender: 'Female',
    fabric: 'Cotton Blend',
    size: ['M', 'L', 'XL'],
    color: 'Blue',
    isDiscounted: true,
    combo: true,
    stock: 'Limited Stock'
  },
  {
    id: 3,
    title: 'Summer Dress',
    price: 450.00,
    oldPrice: 550.00,
    discount: '-18%',
    rating: 4,
    reviewCount: 8,
    imageBgColor: '#F5E6D3',
    isFavorite: false,
    image: require('../assets/images/HomeScreenImages/Dress3.png'),

    // 🔽 Added fields
    category: 'Women',
    gender: 'Female',
    fabric: 'Cotton',
    size: ['S', 'M', 'L'],
    color: 'Cream',
    isDiscounted: true,
    combo: false,
    stock: 'In Stock'
  },
  {
    id: 4,
    title: 'Casual T-Shirt',
    price: 399.00,
    oldPrice: 499.00,
    discount: '-20%',
    rating: 3,
    reviewCount: 6,
    imageBgColor: '#D6E4E5',
    isFavorite: false,
    image: require('../assets/images/HomeScreenImages/Dress1.png'),

    // 🔽 Added fields
    category: 'Men',
    gender: 'Male',
    fabric: 'Cotton',
    size: ['M', 'L'],
    color: 'Green',
    isDiscounted: true,
    combo: false,
    stock: 'In Stock'
  },
  {
    id: 5,
    title: 'Formal Shirt',
    price: 899.00,
    oldPrice: 1299.00,
    discount: '-30%',
    rating: 5,
    reviewCount: 22,
    imageBgColor: '#E8D7C1',
    isFavorite: false,
    image: require('../assets/images/HomeScreenImages/Dress2.png'),

    // 🔽 Added fields
    category: 'Men',
    gender: 'Male',
    fabric: 'Linen',
    size: ['L', 'XL'],
    color: 'White',
    isDiscounted: true,
    combo: true,
    stock: 'In Stock'
  }
];


  
    export const categoryOptions = [
  { id: '1', label: 'Shirts' },
  { id: '2', label: 'T-shirts' },
  { id: '3', label: 'Accessories' },
  { id: '4', label: 'Backpacks' },
  { id: '5', label: 'Hats' },
  { id: '6', label: 'Watches' },
  { id: '7', label: 'Formal Wear' },
];

  export const sortOptions = [
    { id: '1', label: 'Popular', value: 'popular' },
    { id: '2', label: 'Newest', value: 'newest' },
    { id: '3', label: 'Customer review', value: 'review' },
    { id: '4', label: 'Price: lowest to high', value: 'price_low' },
    { id: '5', label: 'Price: highest to low', value: 'price_high' },
  ];

  
  export const filterSections = [
  {
    key: 'category',
    title: 'Category',
    options: [
      { id: '1', label: 'T-shirts' },
      { id: '2', label: 'Shirts' },
      { id: '3', label: 'Accessories' },
      { id: '4', label: 'Backpacks' },
      { id: '5', label: 'Hats' },
    ]
  },
  {
    key: 'gender',
    title: 'Gender',
    options: [
      { id: '1', label: 'Male' },
      { id: '2', label: 'Female' }
    ]
  },
  {
    key: 'fabric',
    title: 'Fabric',
    options: [
      { id: '1', label: 'Acrylic' },
      { id: '2', label: 'Art Silk' },
      { id: '3', label: 'Bamboo' },
      { id: '4', label: 'Chanderi Cotton' },
      { id: '5', label: 'Chiffon' },
      { id: '6', label: 'Cotton' },
      { id: '7', label: 'Cotton Blend' },
      { id: '8', label: 'Cotton Linen' },
      { id: '9', label: 'Cotton Silk' },
    ]
  },
  {
    key: 'color',
    title: 'Color',
    options: [
      { id: '1', label: 'Beign' },
      { id: '2', label: 'Black' },
      { id: '3', label: 'Red' },
      { id: '4', label: 'Blue' },
      { id: '5', label: 'Pink' },
      { id: '6', label: 'Grey' },
      { id: '7', label: 'Yellow' }
    ]
  },
  {
    key: 'price',
    title: 'Price',
    options: [
      { id: '1', label: 'Under ₹149' },
      { id: '2', label: 'Under ₹199' },
      { id: '3', label: 'Under ₹299' },
      { id: '4', label: 'Under ₹399' },
      { id: '5', label: 'Under ₹499' },
      { id: '6', label: 'Under ₹599' },
    ]
  },
  {
    key: 'discount',
    title: 'Discount',
    options: [
      { id: '1', label: '10% and above' },
      { id: '2', label: '20% and above' },
      { id: '3', label: 'All Discounted' },
      { id: '4', label: 'Deals' },
      // { id: '2', label: 'Female' }
    ]
  },
  {
    key: 'rating',
    title: 'Rating',
    options: [
      { id: '1', label: '2.0 and above' },
      { id: '2', label: '3.0 and above' },
      { id: '3', label: '4.0 and above' },
      { id: '4', label: '5.0 and above' },
      { id: '5', label: 'M-Trusted' }
    ]
  },
  {
    key: 'size',
    title: 'Size',
    options: [
      { id: '1', label: 'L' },
      { id: '2', label: 'M' },
      { id: '3', label: 'S' },
      { id: '4', label: 'XL' },
      { id: '5', label: 'XXL' },
    ]
  },
  {
    key: 'combo',
    title: 'Combo',
    options: [
      { id: '1', label: 'Combos' },
      { id: '2', label: 'Pack of 1' },
      { id: '3', label: 'Pack of 5' },
      { id: '4', label: 'Single' }
    ]
  },
  // add more…
];