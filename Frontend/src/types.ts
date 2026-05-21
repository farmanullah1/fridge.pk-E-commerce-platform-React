export interface User {
  name: string;
  email: string;
  phone?: string;
  token?: string;
  role?: 'customer' | 'seller';
}

export type ActiveView = 
  | 'landing'
  | 'home' 
  | 'login' 
  | 'signup' 
  | 'forgot-password' 
  | 'dashboard' 
  | 'products' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'account' 
  | 'seller' 
  | 'track-order'
  | 'wishlist'
  | 'compare'
  | 'ai-assistant'
  | 'bill-calculator'
  | 'ar-visualizer'
  | 'faq'
  | 'returns-policy'
  | 'developer-profile'
  | 'appliance-matcher';

export type ProductCategory = 'single-door' | 'double-door' | 'side-by-side' | 'deep-freezer' | 'air-conditioner' | 'water-dispenser';

export interface Review {
  id: string;
  user: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory | string;
  price: number; // PKR Rs.
  originalPrice?: number;
  image: string; // Primary image
  images?: string[]; // Multiple thumbnails
  description: string;
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
  inStock: boolean;
  stock?: number;
  brand?: string;
  ordersCount?: number;
  sellerType?: 'official' | 'individual';
  isNew?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;
  discountPercentage?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: 'S' | 'M' | 'L' | 'XL' | 'Unstitched' | 'Default';
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  area: string;
  addressLines: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: 'Order placed' | 'Processing' | 'Payment confirmed' | 'Shipped' | 'Out for delivery' | 'Delivered' | 'Cancelled';
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'cod' | 'easypaisa';
  shippingAddress: {
    fullName: string;
    phone: string;
    city: string;
    area: string;
    addressLines: string;
  };
}
