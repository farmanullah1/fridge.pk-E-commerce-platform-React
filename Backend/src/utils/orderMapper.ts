import { IOrder } from '../models/Order.js';
import { Product } from '../models/Product.js';

export async function toOrderResponse(doc: IOrder) {
  const items = await Promise.all(
    doc.items.map(async (item) => {
      const product = await Product.findOne({ productId: item.productId });
      return {
        product: product
          ? {
              id: product.productId,
              name: product.name,
              category: product.category,
              price: product.price,
              image: product.image,
              description: product.description,
              rating: product.rating,
              reviewsCount: product.reviewsCount,
              inStock: product.inStock,
            }
          : {
              id: item.productId,
              name: item.name,
              category: item.category || '',
              price: item.price,
              image: item.image || '',
              description: '',
              rating: 0,
              reviewsCount: 0,
              inStock: true,
            },
        quantity: item.quantity,
        size: item.size,
      };
    })
  );

  return {
    id: doc.orderId,
    date: doc.date,
    items,
    subtotal: doc.subtotal,
    discount: doc.discount,
    shippingFee: doc.shippingFee,
    total: doc.total,
    status: doc.status,
    deliveryMethod: doc.deliveryMethod,
    paymentMethod: doc.paymentMethod,
    shippingAddress: doc.shippingAddress,
  };
}
