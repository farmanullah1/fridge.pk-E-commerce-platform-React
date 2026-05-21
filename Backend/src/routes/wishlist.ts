import { Router, Response } from 'express';
import { Wishlist } from '../models/Wishlist.js';
import { Product } from '../models/Product.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { toProductResponse } from '../utils/productMapper.js';

const router = Router();

router.use(requireAuth);

async function getOrCreateWishlist(userId: string) {
  let list = await Wishlist.findOne({ userId });
  if (!list) {
    list = await Wishlist.create({ userId, productIds: [] });
  }
  return list;
}

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const list = await getOrCreateWishlist(req.userId!);
    const products = await Product.find({ productId: { $in: list.productIds } });
    const ordered = list.productIds
      .map((id) => products.find((p) => p.productId === id))
      .filter(Boolean)
      .map((p) => toProductResponse(p!));
    res.json(ordered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

router.post('/:productId', async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const list = await getOrCreateWishlist(req.userId!);
    if (!list.productIds.includes(req.params.productId)) {
      list.productIds.push(req.params.productId);
      await list.save();
    }
    res.json({ message: 'Added to wishlist', product: toProductResponse(product) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

router.delete('/:productId', async (req: AuthRequest, res: Response) => {
  try {
    const list = await getOrCreateWishlist(req.userId!);
    list.productIds = list.productIds.filter((id) => id !== req.params.productId);
    await list.save();
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

router.put('/sync', async (req: AuthRequest, res: Response) => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ error: 'productIds array required' });
    }
    await Wishlist.findOneAndUpdate(
      { userId: req.userId },
      { productIds },
      { upsert: true, new: true }
    );
    res.json({ message: 'Wishlist synced' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync wishlist' });
  }
});

export default router;
