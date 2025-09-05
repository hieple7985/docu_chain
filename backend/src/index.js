#!/usr/bin/env node

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const documentRoutes = require('./routes/documents');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// Render sits behind a proxy
app.set('trust proxy', 1);

// Middleware
// CORS: allowlist via env (comma-separated)
const allowedOrigins = (process.env.CORS_ORIGINS || '*')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Conditionally enable request logging
if (process.env.REQUEST_LOGGING !== 'off') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Serve frontend build (single-port deploy) - optional via env
if (process.env.SERVE_FRONTEND === 'true') {
  const frontendBuildPath = path.join(__dirname, '../../frontend/build');
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    // Do not hijack API routes
    if (req.path.startsWith('/api')) return res.status(404).json({ message: 'Not Found' });
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Foxit health (sanity)
app.get('/api/integrations/foxit/health', async (req, res) => {
  try {
    const foxitService = require('./services/foxitService');
    const pdfCheck = await foxitService.checkAuth('pdf');
    const docgenCheck = await foxitService.checkAuth('docgen');
    res.status(200).json({ success: true, pdf: pdfCheck, docgen: docgenCheck });
  } catch (e) {
    res.status(200).json({ success: false, error: e.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});
