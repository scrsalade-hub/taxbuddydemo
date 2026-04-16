import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth middleware - token:', token ? 'present' : 'missing');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth middleware - decoded:', decoded);
      
      req.user = await User.findById(decoded.id).select('-password');
      console.log('Auth middleware - req.user:', req.user ? 'found' : 'not found');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};
