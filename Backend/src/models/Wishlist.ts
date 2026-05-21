import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  productIds: string[];
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    productIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
