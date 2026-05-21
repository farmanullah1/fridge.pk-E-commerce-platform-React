import { IProduct } from '../models/Product.js';

export function toProductResponse(doc: IProduct) {
  return {
    id: doc.productId,
    name: doc.name,
    category: doc.category,
    price: doc.price,
    originalPrice: doc.originalPrice,
    image: doc.image,
    images: doc.images,
    description: doc.description,
    rating: doc.rating,
    reviewsCount: doc.reviewsCount,
    reviews: doc.reviews,
    inStock: doc.inStock,
    stock: doc.stock,
    brand: doc.brand,
    ordersCount: doc.ordersCount,
    sellerType: doc.sellerType,
    isNew: doc.isNew,
    isTrending: doc.isTrending,
    isFlashSale: doc.isFlashSale,
    discountPercentage: doc.discountPercentage,
  };
}
