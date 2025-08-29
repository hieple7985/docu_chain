#!/usr/bin/env node

const express = require('express');
const router = express.Router();
// Controller sẽ được tạo sau
// const authController = require('../controllers/authController');

// POST /api/auth/register - Đăng ký tài khoản mới
router.post('/register', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { 
      id: 'user-id',
      email: req.body.email,
      name: req.body.name
    }
  });
});

// POST /api/auth/login - Đăng nhập
router.post('/login', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token: 'sample-jwt-token',
    user: {
      id: 'user-id',
      email: req.body.email,
      name: 'Sample User'
    }
  });
});

// POST /api/auth/logout - Đăng xuất
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// GET /api/auth/me - Lấy thông tin người dùng hiện tại
router.get('/me', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User profile retrieved',
    data: {
      id: 'user-id',
      email: 'user@example.com',
      name: 'Sample User'
    }
  });
});

// PUT /api/auth/me - Cập nhật thông tin người dùng
router.put('/me', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User profile updated',
    data: {
      id: 'user-id',
      email: req.body.email || 'user@example.com',
      name: req.body.name || 'Sample User'
    }
  });
});

// POST /api/auth/forgot-password - Quên mật khẩu
router.post('/forgot-password', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Password reset email sent'
  });
});

// POST /api/auth/reset-password - Đặt lại mật khẩu
router.post('/reset-password', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Password reset successful'
  });
});

module.exports = router;
