import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { Product } from './models/Product.js';
import { seedProducts } from './data/seedProducts.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import addressRoutes from './routes/addresses.js';
import wishlistRoutes from './routes/wishlist.js';
import aiRoutes from './routes/ai.js';
import categoryRoutes from './routes/categories.js';
import sellerRoutes from './routes/seller.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'fridge.pk-api', env: env.nodeEnv });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/seller', sellerRoutes);

async function autoSeedIfEmpty() {
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log('No products in DB — auto-seeding catalog...');
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
    console.log(`Auto-seeded ${seedProducts.length} products.`);
  }
}

async function start() {
  await connectDB();
  await autoSeedIfEmpty();

  if (env.nodeEnv === 'production') {
    const frontendDist = path.join(__dirname, '../../Frontend/dist');
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(env.port, () => {
    console.log(`fridge.pk API running at http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
