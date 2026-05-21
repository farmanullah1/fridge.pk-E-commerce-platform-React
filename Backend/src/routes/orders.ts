import { Router, Response } from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { AuthRequest, optionalAuth, requireAuth } from '../middleware/auth.js';
import { toOrderResponse } from '../utils/orderMapper.js';

const router = Router();

function generateOrderId(): string {
  return `FR-${Math.floor(10000 + Math.random() * 90000)}`;
}

router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    const mapped = await Promise.all(orders.map(toOrderResponse));
    res.json(mapped);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/track/:orderId', optionalAuth, async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId.toUpperCase(),
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(await toOrderResponse(order));
  } catch (err) {
    res.status(500).json({ error: 'Failed to track order' });
  }
});

router.post('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;
    const items = body.items;
    if (!items?.length || body.total == null) {
      return res.status(400).json({ error: 'Invalid order: items and total are required' });
    }

    for (const it of items) {
      const product = await Product.findOne({ productId: it.product.id });
      if (!product) {
        return res.status(400).json({ error: `Product "${it.product.name}" is no longer available` });
      }
      if (!product.inStock || (product.stock != null && product.stock < it.quantity)) {
        return res.status(400).json({
          error: `Insufficient stock for "${product.name}". Available: ${product.stock ?? 0}`,
        });
      }
    }

    const orderId = (body.id || generateOrderId()).toUpperCase();
    const order = await Order.create({
      orderId,
      userId: req.userId || undefined,
      date: body.date || new Date().toISOString().split('T')[0],
      items: items.map(
        (it: {
          product: { id: string; name: string; category?: string; price: number; image?: string };
          quantity: number;
          size: string;
        }) => ({
          productId: it.product.id,
          name: it.product.name,
          category: it.product.category,
          price: it.product.price,
          image: it.product.image,
          quantity: it.quantity,
          size: it.size,
        })
      ),
      subtotal: body.subtotal,
      discount: body.discount ?? 0,
      shippingFee: body.shippingFee ?? 0,
      total: body.total,
      status: 'Order placed',
      deliveryMethod: body.deliveryMethod || 'standard',
      paymentMethod: body.paymentMethod || 'cod',
      shippingAddress: body.shippingAddress,
    });

    for (const it of items) {
      const product = await Product.findOne({ productId: it.product.id });
      if (product) {
        if (product.stock != null) {
          product.stock = Math.max(0, product.stock - it.quantity);
          product.inStock = product.stock > 0;
        }
        product.ordersCount = (product.ordersCount || 0) + it.quantity;
        await product.save();
      }
    }

    res.status(201).json({
      message: 'Order placed successfully',
      order: await toOrderResponse(order),
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

router.patch('/:orderId/cancel', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId, userId: req.userId });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (!['Order placed', 'Processing'].includes(order.status)) {
      return res.status(400).json({ error: 'This order cannot be cancelled' });
    }

    order.status = 'Cancelled';
    await order.save();

    for (const item of order.items) {
      const product = await Product.findOne({ productId: item.productId });
      if (product && product.stock != null) {
        product.stock += item.quantity;
        product.inStock = true;
        await product.save();
      }
    }

    res.json({ message: 'Order cancelled', order: await toOrderResponse(order) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

export default router;
