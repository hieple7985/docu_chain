#!/usr/bin/env node

const Document = require('../models/Document');
const foxitService = require('../services/foxitService');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res, next) => {
  try {
    // Lấy documents của user hiện tại
    const documents = await Document.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Kiểm tra quyền sở hữu
    if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this document'
      });
    }

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Create new document
// @route   POST /api/documents
// @access  Private
exports.createDocument = async (req, res, next) => {
  try {
    // Thêm user ID vào document
    req.body.user = req.user.id;

    const document = await Document.create(req.body);

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private
exports.updateDocument = async (req, res, next) => {
  try {
    let document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Kiểm tra quyền sở hữu
    if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this document'
      });
    }

    document = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Kiểm tra quyền sở hữu
    if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this document'
      });
    }

    await document.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Convert document
// @route   POST /api/documents/convert
// @access  Private
exports.convertDocument = async (req, res, next) => {
  try {
    // Xử lý chuyển đổi tài liệu sẽ được thêm sau khi tích hợp Foxit SDK
    res.status(200).json({
      success: true,
      message: 'Document conversion feature will be implemented with Foxit SDK',
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Merge documents
// @route   POST /api/documents/merge
// @access  Private
exports.mergeDocuments = async (req, res, next) => {
  try {
    // Xử lý ghép tài liệu sẽ được thêm sau khi tích hợp Foxit SDK
    res.status(200).json({
      success: true,
      message: 'Document merge feature will be implemented with Foxit SDK',
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Split document
// @route   POST /api/documents/split
// @access  Private
exports.splitDocument = async (req, res, next) => {
  try {
    const { documentId, pages } = req.body;
    
    if (!documentId || !pages || !Array.isArray(pages)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide document ID and pages array'
      });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Read file from disk
    const filePath = path.join(__dirname, '../../uploads', document.fileUrl);
    const fileBuffer = await fs.readFile(filePath);
    
    // Split PDF using Foxit API
    const result = await foxitService.splitPDF(fileBuffer, pages);
    
    res.status(200).json({
      success: true,
      message: 'Document split successfully',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Optimize document
// @route   POST /api/documents/optimize
// @access  Private
exports.optimizeDocument = async (req, res, next) => {
  try {
    const { documentId } = req.body;
    
    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide document ID'
      });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Read file from disk
    const filePath = path.join(__dirname, '../../uploads', document.fileUrl);
    const fileBuffer = await fs.readFile(filePath);
    
    // Optimize PDF using Foxit API
    const result = await foxitService.optimizePDF(fileBuffer);
    
    res.status(200).json({
      success: true,
      message: 'Document optimized successfully',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Extract text from document
// @route   POST /api/documents/extract-text
// @access  Private
exports.extractText = async (req, res, next) => {
  try {
    const { documentId } = req.body;
    
    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide document ID'
      });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Read file from disk
    const filePath = path.join(__dirname, '../../uploads', document.fileUrl);
    const fileBuffer = await fs.readFile(filePath);
    
    // Extract text using Foxit API
    const result = await foxitService.extractText(fileBuffer);
    
    res.status(200).json({
      success: true,
      message: 'Text extracted successfully',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Sign document
// @route   POST /api/documents/sign
// @access  Private
exports.signDocument = async (req, res, next) => {
  try {
    // Xử lý ký tài liệu sẽ được thêm sau khi tích hợp Foxit SDK
    res.status(200).json({
      success: true,
      message: 'Document signing feature will be implemented with Foxit SDK',
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Protect document with password
// @route   POST /api/documents/protect
// @access  Private
exports.protectDocument = async (req, res, next) => {
  try {
    const { documentId, password } = req.body;
    
    if (!documentId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide document ID and password'
      });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Read file from disk
    const filePath = path.join(__dirname, '../../uploads', document.fileUrl);
    const fileBuffer = await fs.readFile(filePath);
    
    // Protect PDF using Foxit API
    const result = await foxitService.protectPDF(fileBuffer, password);
    
    // Update document in database
    document.isProtected = true;
    document.password = password;
    await document.save();
    
    res.status(200).json({
      success: true,
      message: 'Document protected successfully',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};
