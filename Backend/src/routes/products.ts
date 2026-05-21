import { Router, Response } from 'express';
import { Product } from '../models/Product.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { toProductResponse } from '../utils/productMapper.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      brand,
      minPrice,
      maxPrice,
      inStock,
      sellerType,
      sort = 'newest',
      limit = '100',
    } = req.query;

    const filter: Record<string, unknown> = {};

    if (category && category !== 'all') filter.category = category;
    if (brand) filter.brand = brand;
    if (sellerType) filter.sellerType = sellerType;
    if (inStock === 'true') filter.inStock = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }
    if (search && typeof search === 'string') {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ];
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'popular':
        sortOption = { ordersCount: -1 };
        break;
      case 'trending':
        sortOption = { isTrending: -1, ordersCount: -1 };
        break;
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(Math.min(Number(limit) || 100, 200));

    res.json(products.map(toProductResponse));
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(toProductResponse(product));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/', requireAuth, requireRole('seller'), async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;
    const productId = body.id || `p-sel-${Date.now()}`;

    const existing = await Product.findOne({ productId });
    if (existing) return res.status(409).json({ error: 'Product ID already exists' });

    const product = await Product.create({
      productId,
      name: body.name,
      category: body.category,
      price: body.price,
      originalPrice: body.originalPrice,
      image: body.image,
      images: body.images,
      description: body.description || '',
      rating: body.rating ?? 4.5,
      reviewsCount: body.reviewsCount ?? 0,
      reviews: body.reviews ?? [],
      inStock: body.inStock ?? true,
      stock: body.stock ?? 10,
      brand: body.brand,
      ordersCount: body.ordersCount ?? 0,
      sellerType: body.sellerType ?? 'individual',
      sellerId: req.userId,
      isNew: body.isNew ?? true,
      isTrending: body.isTrending,
      isFlashSale: body.isFlashSale,
      discountPercentage: body.discountPercentage,
    });

    res.status(201).json({ message: 'Product created', product: toProductResponse(product) });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', requireAuth, requireRole('seller'), async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOne({ productId: req.params.id, sellerId: req.userId });
    if (!product) return res.status(404).json({ error: 'Product not found or not owned by you' });

    const fields = [
      'name', 'category', 'price', 'originalPrice', 'image', 'images', 'description',
      'inStock', 'stock', 'brand', 'isNew', 'isTrending', 'isFlashSale', 'discountPercentage',
    ] as const;

    for (const key of fields) {
      if (req.body[key] !== undefined) (product as Record<string, unknown>)[key] = req.body[key];
    }

    await product.save();
    res.json({ message: 'Product updated', product: toProductResponse(product) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', requireAuth, requireRole('seller'), async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOneAndDelete({
      productId: req.params.id,
      sellerId: req.userId,
    });
    if (!product) {
      const exists = await Product.findOne({ productId: req.params.id });
      if (exists) return res.status(403).json({ error: 'You can only delete your own listings' });
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product removed', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

router.post('/:id/reviews', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { comment, rating, city } = req.body;
    if (!comment?.trim()) return res.status(400).json({ error: 'Comment is required' });

    const product = await Product.findOne({ productId: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const review = {
      id: `rev-${Date.now()}`,
      user: req.user!.name,
      city: city || 'Pakistan',
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    product.reviews.unshift(review);
    product.reviewsCount = product.reviews.length;
    const avg = product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;
    product.rating = Math.round(avg * 10) / 10;
    await product.save();

    res.status(201).json({ message: 'Review added', review, product: toProductResponse(product) });
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

export default router;
