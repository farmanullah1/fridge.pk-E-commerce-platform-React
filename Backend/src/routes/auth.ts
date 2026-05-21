import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { AuthRequest, requireAuth, signToken } from '../middleware/auth.js';

const router = Router();

function formatUser(user: InstanceType<typeof User>, token: string) {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    token,
  };
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashed,
      role: role === 'seller' ? 'seller' : 'customer',
    });

    const token = signToken(user._id.toString(), user.email, user.name, user.role);
    res.status(201).json({ message: 'Account created', user: formatUser(user, token) });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }

    const isEmail = identifier.includes('@');
    const query = isEmail
      ? { email: identifier.toLowerCase() }
      : { phone: identifier };

    const user = await User.findOne(query).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user._id.toString(), user.email, user.name, user.role);
    res.json({ message: 'Login successful', user: formatUser(user, token) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  res.json({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  });
});

router.put('/profile', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone } = req.body;
    const user = req.user!;

    if (email && email.toLowerCase() !== user.email) {
      const taken = await User.findOne({ email: email.toLowerCase() });
      if (taken) return res.status(409).json({ error: 'Email already in use' });
      user.email = email.toLowerCase();
    }
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();

    res.json({ message: 'Profile updated', user: { name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

router.put('/change-password', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old and new passwords are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.userId).select('+password');
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Password change failed' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ error: 'Email or phone is required' });

    const isEmail = identifier.includes('@');
    const user = await User.findOne(
      isEmail ? { email: identifier.toLowerCase() } : { phone: identifier }
    ).select('+resetOtp +resetOtpExpires');

    if (!user) {
      return res.json({ message: 'If an account exists, an OTP has been sent', devOtp: null });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    res.json({
      message: 'OTP sent successfully',
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const isEmail = identifier?.includes('@');
    const user = await User.findOne(
      isEmail ? { email: identifier.toLowerCase() } : { phone: identifier }
    ).select('+resetOtp +resetOtpExpires');

    if (!user || user.resetOtp !== otp || !user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified', resetToken: user._id.toString() });
  } catch (err) {
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { identifier, otp, password } = req.body;
    const isEmail = identifier?.includes('@');
    const user = await User.findOne(
      isEmail ? { email: identifier.toLowerCase() } : { phone: identifier }
    ).select('+password +resetOtp +resetOtpExpires');

    if (!user || user.resetOtp !== otp || !user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Password reset failed' });
  }
});

export default router;
