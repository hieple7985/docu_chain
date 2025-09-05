#!/usr/bin/env node

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require valid JWT in Authorization header as 'Bearer <token>'
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request (minimal payload)
    req.user = { id: decoded.id };

    // Optionally verify user still exists
    const userExists = await User.findById(decoded.id).select('_id');
    if (!userExists) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};