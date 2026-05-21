import mongoose, { Schema, Document } from 'mongoose';

const cartItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    category: String,
    price: { type: Number, required: true },
    image: String,
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    fullName: String,
    phone: String,
    city: String,
    area: String,
    addressLines: String,
  },
  { _id: false }
);

export interface IOrder extends Document {
  orderId: string;
  userId?: mongoose.Types.ObjectId;
  date: string;
  items: {
    productId: string;
    name: string;
    category?: string;
    price: number;
    image?: string;
    quantity: number;
    size: string;
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: string;
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

const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: String, required: true },
    items: { type: [cartItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        'Order placed',
        'Processing',
        'Payment confirmed',
        'Shipped',
        'Out for delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Order placed',
    },
    deliveryMethod: { type: String, enum: ['standard', 'express'], default: 'standard' },
    paymentMethod: { type: String, enum: ['card', 'cod', 'easypaisa'], default: 'cod' },
    shippingAddress: { type: shippingAddressSchema, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);
