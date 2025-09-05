#!/usr/bin/env node

const express = require('express');
const router = express.Router();
// Controller sẽ được tạo sau
// const authController = require('../controllers/authController');
const { register, login, getMe, updateDetails, updatePassword, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/register - Đăng ký tài khoản mới
router.post('/register', register);

// POST /api/auth/login - Đăng nhập
router.post('/login', login);

// POST /api/auth/logout - Đăng xuất
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// GET /api/auth/me - Lấy thông tin người dùng hiện tại
router.get('/me', protect, getMe);

// PUT /api/auth/me - Cập nhật thông tin người dùng
router.put('/me', protect, updateDetails);

// POST /api/auth/forgot-password - Quên mật khẩu
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password - Đặt lại mật khẩu
router.post('/reset-password', resetPassword);

module.exports = router;
