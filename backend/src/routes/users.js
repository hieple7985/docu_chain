#!/usr/bin/env node

const express = require('express');
const router = express.Router();
// Controller sẽ được tạo sau
// const userController = require('../controllers/userController');
const userController = require('../controllers/userController');
const { getMe, updateDetails, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Profile routes to match frontend API_ENDPOINTS.PROFILE
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateDetails);
router.put('/profile/password', protect, updatePassword);

// GET /api/users - Lấy danh sách người dùng (admin only)
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get all users',
    data: []
  });
});

// GET /api/users/:id - Lấy thông tin người dùng theo ID
router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Get user with id: ${req.params.id}`,
    data: { id: req.params.id, name: 'Sample User', email: 'user@example.com' }
  });
});

// PUT /api/users/:id - Cập nhật thông tin người dùng
router.put('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: `User with id: ${req.params.id} updated successfully`,
    data: { id: req.params.id, ...req.body }
  });
});

// DELETE /api/users/:id - Xóa người dùng
router.delete('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: `User with id: ${req.params.id} deleted successfully`
  });
});

// GET /api/users/:id/documents - Lấy danh sách tài liệu của người dùng
router.get('/:id/documents', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Get documents for user with id: ${req.params.id}`,
    data: []
  });
});

module.exports = router;
