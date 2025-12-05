import express from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('ranger', 'engineer', 'admin', 'super_admin').default('ranger'),
});

router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Registration attempt:', { name, email, role });
    
    // Check mongoose connection
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB not connected. State:', mongoose.connection.readyState);
      return res.status(503).json({ message: 'Database not connected' });
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Email already exists:', email);
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    const passwordHash = await hashPassword(password);
    console.log('Password hashed, creating user...');
    
    const userData = { 
      name, 
      email, 
      passwordHash, 
      role: role || 'ranger' 
    };
    
    console.log('Creating user with data:', { ...userData, passwordHash: '***' });
    
    const user = await User.create(userData);
    
    console.log('User created successfully:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    
    const payload = { sub: user._id, role: user.role, name: user.name };
    res.status(201).json({
      accessToken: signAccess(payload),
      refreshToken: signRefresh(payload),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const payload = { sub: user._id, role: user.role, name: user.name };
  res.json({
    accessToken: signAccess(payload),
    refreshToken: signRefresh(payload),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

router.post('/refresh', validate(refreshSchema), async (req, res) => {
  try {
    const payload = verifyRefresh(req.body.refreshToken);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Invalid refresh' });
    const newPayload = { sub: user._id, role: user.role, name: user.name };
    res.json({ accessToken: signAccess(newPayload) });
  } catch {
    res.status(401).json({ message: 'Invalid refresh' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.sub).select('-passwordHash');
  res.json(user);
});

export default router;

