import { Product, Review, Address } from './types';

export const mockCustomerReviews: Review[] = [
  {
    id: 'r1',
    user: 'Farman Ansari',
    city: 'Karachi',
    rating: 5,
    comment: ' Dawlance Inverter Refrigerator has cut my monthly electricity bill in half! Cooling retention during load shedding is around 8-10 hours. Perfect service by fridge.pk!',
    date: '2026-05-18'
  },
  {
    id: 'r2',
    user: 'Amna Shah',
    city: 'Lahore',
    rating: 5,
    comment: 'The Gree Pular AC cools our study room in under 5 minutes. The G-10 inverter is whisper quiet. Brilliant deal-driven checkout!',
    date: '2026-05-15'
  },
  {
    id: 'r3',
    user: 'Hamza Lodhi',
    city: 'Islamabad',
    rating: 4,
    comment: 'The Pel Water Dispenser with intermediate cupboard fridge is super useful. Compact, cools water exceptionally well even in heavy hostelling spaces.',
    date: '2026-05-10'
  },
  {
    id: 'r4',
    user: 'Sara Saleem',
    city: 'Faisalabad',
    rating: 5,
    comment: 'Dawlance Chest Freezer holds frozen meat perfectly through extreme Punjab heat waves. Very secure package delivery.',
    date: '2026-05-02'
  }
];

export const mockProducts: Product[] = [
  // Double Door Refrigerators (double-door)
  {
    id: 'dd1',
    name: 'Pel Pride Inverter Refrigerator 3300 Pro',
    category: 'double-door',
    price: 72000,
    originalPrice: 85000,
    discountPercentage: 15,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1571175487739-4ad331ee0cc1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'The Pride Inverter series uses Pelican Premium compressor technology to provide Frost-Free cooling and instant ice making within 25 minutes. Features fully tempered glass shelves, anti-fungal door gasket, and low voltage operation down to 140V.',
    rating: 4.8,
    reviewsCount: 145,
    reviews: [
      { id: 'r11', user: 'Zeeshan Ali', city: 'Sialkot', rating: 5, comment: 'Phenomenal cooling with low voltage resilience! Tested at peak summer temp and works like a charm.', date: '2026-05-19' },
      { id: 'r12', user: 'Ali Raza', city: 'Karachi', rating: 4, comment: 'Bigger than it looks. The freezer cabin size is massive.', date: '2026-05-14' }
    ],
    inStock: true,
    stock: 9,
    brand: 'PEL',
    ordersCount: 310,
    sellerType: 'official',
    isNew: true,
    isTrending: true,
    isFlashSale: true
  },
  {
    id: 'dd2',
    name: 'Dawlance Reflex Digital Inverter 9193-GD Slim',
    category: 'double-door',
    price: 89500,
    originalPrice: 99000,
    discountPercentage: 10,
    image: 'https://images.unsplash.com/photo-1571175487739-4ad331ee0cc1?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1571175487739-4ad331ee0cc1?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Equipped with Vitamin Fresh Technology that maintains vitamin levels inside green groceries for up to 20 days. Active Odor Filter runs ozone-scrubbers silently to preserve fresh dairy textures.',
    rating: 4.9,
    reviewsCount: 220,
    reviews: [],
    inStock: true,
    stock: 12,
    brand: 'Dawlance',
    ordersCount: 450,
    sellerType: 'official',
    isTrending: true
  },

  // Single Door (single-door)
  {
    id: 'sd1',
    name: 'Haier Direct-Cool HR-135G Compact Refrigerator',
    category: 'single-door',
    price: 38000,
    originalPrice: 42000,
    discountPercentage: 10,
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'The optimal secondary refrigerating choice for master bedrooms, luxury lounge retreats, or dorm setups. Built with dynamic direct cool channels, a integrated mini-freezer zone, and premium glass door finish.',
    rating: 4.6,
    reviewsCount: 38,
    reviews: [],
    inStock: true,
    stock: 15,
    brand: 'Haier',
    ordersCount: 88,
    sellerType: 'official',
    isNew: true,
    isFlashSale: true
  },

  // Side-by-Side Luxury (side-by-side)
  {
    id: 'sb1',
    name: 'Haier Digital Quad-Inverter Luxury Four-Door Refrigerator',
    category: 'side-by-side',
    price: 245000,
    originalPrice: 280000,
    discountPercentage: 13,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'The pinnacle of luxury food preservation. Incorporates dynamic dual cooling zones (Separate Freezer and Fridge Loops) to prevent odor mixing. Includes custom touch temperature regulators and automatic smart holiday modes.',
    rating: 4.9,
    reviewsCount: 64,
    reviews: [
      { id: 'r22', user: 'Saad Malik', city: 'Islamabad', rating: 5, comment: 'Spectacular modular compartments. Complete state-of-the-art compressor.', date: '2026-05-17' }
    ],
    inStock: true,
    stock: 5,
    brand: 'Haier',
    ordersCount: 52,
    sellerType: 'official',
    isNew: true,
    isTrending: true
  },
  {
    id: 'sb2',
    name: 'Samsung Bespoke Family-Hub Smart Refrigerator',
    category: 'side-by-side',
    price: 485000,
    originalPrice: 530000,
    discountPercentage: 8,
    image: 'https://images.unsplash.com/photo-1571175487739-4ad331ee0cc1?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1571175487739-4ad331ee0cc1?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Features fully integrated Wi-Fi connection, dynamic camera lenses inside to monitor food fresh periods, customizable modular glass panes and immersive surround sound speaker setups.',
    rating: 5.0,
    reviewsCount: 18,
    reviews: [],
    inStock: false,
    stock: 0,
    brand: 'Samsung',
    ordersCount: 14,
    sellerType: 'official',
    isTrending: false
  },

  // Deep Freezers (deep-freezer)
  {
    id: 'df1',
    name: 'Waves Dual-Cabin Fast chest Freezer DF-308',
    category: 'deep-freezer',
    price: 64000,
    originalPrice: 72000,
    discountPercentage: 11,
    image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Featuring separate Dual Cabin temperature selectors. High performance copper condensers generate ice within 15 minutes. Excellent cooling retention for up to 30 hours during prolonged battery backup cycles.',
    rating: 4.7,
    reviewsCount: 89,
    reviews: [],
    inStock: true,
    stock: 14,
    brand: 'Waves',
    ordersCount: 198,
    sellerType: 'individual',
    isFlashSale: true
  },
  {
    id: 'df2',
    name: 'Dawlance Low-Voltage Safety Deep Freezer DF-92S',
    category: 'deep-freezer',
    price: 58500,
    originalPrice: 65000,
    discountPercentage: 10,
    image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Special Low Voltage Startup technology protects the premium compressor from heavy high fluctuations across urban areas. Stays clean with fully anti-rust metal panels.',
    rating: 4.6,
    reviewsCount: 52,
    reviews: [],
    inStock: true,
    stock: 22,
    brand: 'Dawlance',
    ordersCount: 142,
    sellerType: 'official'
  },

  // Air Conditioners (air-conditioner)
  {
    id: 'ac1',
    name: 'Gree Pular 1.5-Ton Heat & Cool Inverter (GS-18PITH11W)',
    category: 'air-conditioner',
    price: 138000,
    originalPrice: 154000,
    discountPercentage: 10,
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'The award-winning G-10 Hybrid Inverter controls room temperatures down to 0.1C accuracy. Featuring whisper silent 3D airflow, extreme cold-plasma filters, and high-efficiency heat generation in freezing winters.',
    rating: 4.9,
    reviewsCount: 110,
    reviews: [],
    inStock: true,
    stock: 18,
    brand: 'Gree',
    ordersCount: 304,
    sellerType: 'official',
    isTrending: true,
    isFlashSale: true
  },
  {
    id: 'ac2',
    name: 'Haier Pearl 1.5-Ton Smart Inverter AC (HSU-18HFP)',
    category: 'air-conditioner',
    price: 119000,
    originalPrice: 135000,
    discountPercentage: 11,
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Smart self-cleaning technology freezes and washes off internal evaporator dirt instantly. Compatible with complete mobile app scheduling and active voice control models.',
    rating: 4.5,
    reviewsCount: 78,
    reviews: [],
    inStock: true,
    stock: 11,
    brand: 'Haier',
    ordersCount: 156,
    sellerType: 'official',
    isNew: true
  },

  // Water Dispensers (water-dispenser)
  {
    id: 'wd1',
    name: 'Pel Dual-Glass Hot & Cold Water Dispenser (PWD-115)',
    category: 'water-dispenser',
    price: 28500,
    originalPrice: 33000,
    discountPercentage: 13,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Presents triple taps delivering Hot, Cold, and Room-Temperature water instantly. Fitted with high power refrigeration compressors and an ultra-safe child safety lock on hot water taps.',
    rating: 4.6,
    reviewsCount: 44,
    reviews: [],
    inStock: true,
    stock: 16,
    brand: 'PEL',
    ordersCount: 94,
    sellerType: 'official',
    isFlashSale: true
  }
];

export const mockCategories = [
  { id: 'all', name: 'All Appliances', icon: 'ShoppingBag' },
  { id: 'double-door', name: 'Double Door Fridge', icon: 'Refrigerator' },
  { id: 'single-door', name: 'Single Door Fridge', icon: 'Box' },
  { id: 'side-by-side', name: 'Premium Side-by-Side', icon: 'Layers' },
  { id: 'deep-freezer', name: 'Deep Freezers', icon: 'Container' },
  { id: 'air-conditioner', name: 'Inverter ACs', icon: 'Wind' },
  { id: 'water-dispenser', name: 'Water Dispensers', icon: 'Droplets' }
];

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    fullName: 'Farman Ansari',
    phone: '03001234567',
    city: 'Karachi',
    area: 'Clifton Block 5',
    addressLines: 'House 54-B, Marine Heights Lane, adjacent to Boat Basin',
    isDefault: true
  },
  {
    id: 'addr-2',
    fullName: 'Ansari Bros',
    phone: '03211234567',
    city: 'Lahore',
    area: 'Gulberg III',
    addressLines: 'Plot 12-C, Kasuri Road, opposite Al Fatah Superstore',
    isDefault: false
  }
];
