#!/usr/bin/env node

const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const { protect } = require('../middleware/auth');
const foxitService = require('../services/foxitService');

// Configure Multer disk storage for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../..', 'uploads');
    fs.mkdir(uploadDir, { recursive: true }, (err) => cb(err, uploadDir));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${unique}${ext}`);
  }
});

const allowedExts = ['.pdf', '.docx', '.xlsx', '.pptx', '.txt', '.jpg', '.jpeg', '.png'];
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExts.includes(ext)) {
    return cb(new Error('Unsupported file type'));
  }
  cb(null, true);
};

const uploadDisk = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// Helper to map extension to Document.fileType enum
function mapExtToFileType(ext) {
  switch (ext) {
    case '.pdf': return 'pdf';
    case '.docx': return 'docx';
    case '.xlsx': return 'xlsx';
    case '.pptx': return 'pptx';
    case '.txt': return 'txt';
    case '.png': return 'png';
    case '.jpg':
    case '.jpeg': return 'jpg';
    default: return null;
  }
}

// GET /api/documents/_auth-check - Verify OAuth token retrieval (no secrets returned)
router.get('/_auth-check', async (req, res) => {
  try {
    const kind = req.query.kind === 'docgen' ? 'docgen' : 'pdf';
    const result = await foxitService.checkAuth(kind);
    res.status(result.ok ? 200 : 500).json(result);
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// POST /api/documents/upload - Upload a file and create Document
router.post('/upload', protect, uploadDisk.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Missing file' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const fileType = mapExtToFileType(ext);
    if (!fileType) {
      // Should be caught by filter, but double-check
      return res.status(400).json({ success: false, message: 'Unsupported file type' });
    }

    const filename = req.file.filename; // stored by multer
    const fileUrl = `/uploads/${filename}`; // served statically by server

    const docData = {
      name: req.body.name || req.file.originalname,
      description: req.body.description || '',
      fileUrl,
      fileType,
      fileSize: req.file.size,
      user: req.user.id
    };

    const document = await Document.create(docData);

    return res.status(201).json({ success: true, data: document });
  } catch (err) {
    // Attempt to cleanup uploaded file on error
    if (req.file && req.file.path) {
      try { fs.promises.unlink(req.file.path); } catch (_) {}
    }
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/documents - Get all documents for current user
router.get('/', protect, documentController.getDocuments);

// POST /api/documents - Create a new document (metadata only)
router.post('/', protect, documentController.createDocument);

// GET /api/documents/:id - Get document details
router.get('/:id', protect, documentController.getDocument);

// PUT /api/documents/:id - Update a document
router.put('/:id', protect, documentController.updateDocument);

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', protect, documentController.deleteDocument);

// POST /api/documents/convert - Convert document (placeholder)
router.post('/convert', protect, documentController.convertDocument);

// POST /api/documents/merge - Merge documents (placeholder)
router.post('/merge', protect, documentController.mergeDocuments);

// POST /api/documents/split - Split document
router.post('/split', protect, documentController.splitDocument);

// POST /api/documents/optimize - Optimize document (PDF)
router.post('/optimize', protect, documentController.optimizeDocument);

// POST /api/documents/extract-text - Extract text from document (PDF)
router.post('/extract-text', protect, documentController.extractText);

// TEMP: Direct upload endpoints for quick Foxit smoke tests (no DB required)
// POST /api/documents/optimize-upload - multipart form-data with field 'file'
router.post('/optimize-upload', uploadDisk.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Missing file' });
    const buffer = await fs.promises.readFile(req.file.path);
    const result = await foxitService.optimizePDF(buffer);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/documents/extract-upload - multipart form-data with field 'file'
router.post('/extract-upload', uploadDisk.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Missing file' });
    const buffer = await fs.promises.readFile(req.file.path);
    const result = await foxitService.extractText(buffer);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/documents/sign - Sign document (placeholder)
router.post('/sign', protect, documentController.signDocument);

// POST /api/documents/protect - Protect document with password
router.post('/protect', protect, documentController.protectDocument);

module.exports = router;
