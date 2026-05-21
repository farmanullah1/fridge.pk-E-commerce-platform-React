import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { seedProducts } from './data/seedProducts.js';

async function seed() {
  await connectDB();

  await Product.deleteMany({});
  await User.deleteMany({ email: { $in: ['demo@fridge.pk', 'farman.ansari@fridge.pk'] } });

  await Product.insertMany(
    seedProducts.map((p) => ({
      productId: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      images: p.images,
      description: p.description,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      reviews: p.reviews || [],
      inStock: p.inStock,
      stock: p.stock,
      brand: p.brand,
      ordersCount: p.ordersCount,
      sellerType: p.sellerType,
      isNew: p.isNew,
      isTrending: p.isTrending,
      isFlashSale: p.isFlashSale,
      discountPercentage: p.discountPercentage,
    }))
  );

  const demoPassword = await bcrypt.hash('fringe123', 10);
  await User.create({
    name: 'Farman Ansari',
    email: 'farman.ansari@fridge.pk',
    phone: '+923001234567',
    password: demoPassword,
    role: 'customer',
  });

  const seller = await User.create({
    name: 'Demo Seller',
    email: 'demo@fridge.pk',
    phone: '+923001112233',
    password: demoPassword,
    role: 'seller',
  });

  await Product.updateOne({ productId: 'df1' }, { sellerId: seller._id, sellerType: 'individual' });

  console.log(`Seeded ${seedProducts.length} products and 2 demo users.`);
  console.log('Seller login: demo@fridge.pk / fringe123');
  console.log('Demo login: farman.ansari@fridge.pk / fringe123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
