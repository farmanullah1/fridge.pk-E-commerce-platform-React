import { Router, Response } from 'express';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { toProductResponse } from '../utils/productMapper.js';
import { toOrderResponse } from '../utils/orderMapper.js';

const router = Router();

router.use(requireAuth, requireRole('seller'));

router.get('/products', async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find({ sellerId: req.userId }).sort({ createdAt: -1 });
    res.json(products.map(toProductResponse));
  } catch (err) {
    console.error('Seller products error:', err);
    res.status(500).json({ error: 'Failed to fetch seller products' });
  }
});

router.get('/orders', async (req: AuthRequest, res: Response) => {
  try {
    const sellerProducts = await Product.find({ sellerId: req.userId }).select('productId');
    const productIds = sellerProducts.map((p) => p.productId);
    if (productIds.length === 0) {
      res.json([]);
      return;
    }

    const orders = await Order.find({
      'items.productId': { $in: productIds },
      status: { $ne: 'Cancelled' },
    }).sort({ createdAt: -1 });

    const mapped = await Promise.all(orders.map(toOrderResponse));
    res.json(mapped);
  } catch (err) {
    console.error('Seller orders error:', err);
    res.status(500).json({ error: 'Failed to fetch seller orders' });
  }
});

router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const listings = await Product.countDocuments({ sellerId: req.userId });
    const sellerProducts = await Product.find({ sellerId: req.userId }).select('productId');
    const productIds = sellerProducts.map((p) => p.productId);

    const orders = await Order.find({
      'items.productId': { $in: productIds },
      status: { $nin: ['Cancelled'] },
    });

    let revenue = 0;
    let pendingOrders = 0;
    for (const order of orders) {
      for (const item of order.items) {
        if (productIds.includes(item.productId)) {
          revenue += item.price * item.quantity;
          if (['Order placed', 'Processing'].includes(order.status)) pendingOrders++;
        }
      }
    }

    res.json({
      activeListings: listings,
      totalOrders: orders.length,
      pendingOrders,
      revenue,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch seller stats' });
  }
});

router.patch('/orders/:orderId/status', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const allowed = ['Processing', 'Shipped', 'Out for delivery', 'Delivered'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status for seller update' });
    }

    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated', order: await toOrderResponse(order) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
