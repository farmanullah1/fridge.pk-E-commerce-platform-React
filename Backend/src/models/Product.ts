import mongoose, { Schema, Document } from 'mongoose';

export interface IReview {
  id: string;
  user: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
}

export interface IProduct extends Document {
  productId: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  rating: number;
  reviewsCount: number;
  reviews: IReview[];
  inStock: boolean;
  stock?: number;
  brand?: string;
  ordersCount?: number;
  sellerType?: 'official' | 'individual';
  sellerId?: mongoose.Types.ObjectId;
  isNew?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;
  discountPercentage?: number;
}

const reviewSchema = new Schema<IReview>(
  {
    id: { type: String, required: true },
    user: { type: String, required: true },
    city: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    image: { type: String, required: true },
    images: [String],
    description: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    reviews: { type: [reviewSchema], default: [] },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    brand: String,
    ordersCount: { type: Number, default: 0 },
    sellerType: { type: String, enum: ['official', 'individual'], default: 'official' },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
    isNew: Boolean,
    isTrending: Boolean,
    isFlashSale: Boolean,
    discountPercentage: Number,
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
