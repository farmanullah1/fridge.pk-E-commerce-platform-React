import { Router } from 'express';

const router = Router();

const categories = [
  { id: 'all', name: 'All Appliances', icon: 'ShoppingBag' },
  { id: 'double-door', name: 'Double Door Fridge', icon: 'Refrigerator' },
  { id: 'single-door', name: 'Single Door Fridge', icon: 'Box' },
  { id: 'side-by-side', name: 'Premium Side-by-Side', icon: 'Layers' },
  { id: 'deep-freezer', name: 'Deep Freezers', icon: 'Container' },
  { id: 'air-conditioner', name: 'Inverter ACs', icon: 'Wind' },
  { id: 'water-dispenser', name: 'Water Dispensers', icon: 'Droplets' },
];

router.get('/', (_req, res) => {
  res.json(categories);
});

export default router;
