import { Router, Response } from 'express';
import { Address } from '../models/Address.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const addresses = await Address.find({ userId: req.userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(
      addresses.map((a) => ({
        id: a._id.toString(),
        fullName: a.fullName,
        phone: a.phone,
        city: a.city,
        area: a.area,
        addressLines: a.addressLines,
        isDefault: a.isDefault,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, phone, city, area, addressLines, isDefault } = req.body;
    if (!addressLines?.trim() || !area?.trim()) {
      return res.status(400).json({ error: 'Address and area are required' });
    }

    const count = await Address.countDocuments({ userId: req.userId });
    const makeDefault = isDefault ?? count === 0;

    if (makeDefault) {
      await Address.updateMany({ userId: req.userId }, { isDefault: false });
    }

    const addr = await Address.create({
      userId: req.userId,
      fullName: fullName || req.user!.name,
      phone: phone || req.user!.phone || '',
      city: city || 'Karachi',
      area,
      addressLines,
      isDefault: makeDefault,
    });

    res.status(201).json({
      id: addr._id.toString(),
      fullName: addr.fullName,
      phone: addr.phone,
      city: addr.city,
      area: addr.area,
      addressLines: addr.addressLines,
      isDefault: addr.isDefault,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add address' });
  }
});

router.patch('/:id/default', async (req: AuthRequest, res: Response) => {
  try {
    await Address.updateMany({ userId: req.userId }, { isDefault: false });
    const addr = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isDefault: true },
      { new: true }
    );
    if (!addr) return res.status(404).json({ error: 'Address not found' });
    res.json({ message: 'Default address updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update default address' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const addr = await Address.findOne({ _id: req.params.id, userId: req.userId });
    if (!addr) return res.status(404).json({ error: 'Address not found' });
    if (addr.isDefault) {
      return res.status(400).json({ error: 'Cannot delete default address. Set another default first.' });
    }
    await addr.deleteOne();
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

export default router;
