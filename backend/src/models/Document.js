#!/usr/bin/env node

const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide document name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide file URL']
  },
  fileType: {
    type: String,
    required: [true, 'Please provide file type'],
    enum: ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'jpg', 'png']
  },
  fileSize: {
    type: Number,
    required: [true, 'Please provide file size']
  },
  isProtected: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    select: false
  },
  isSigned: {
    type: Boolean,
    default: false
  },
  signatureInfo: {
    type: Object
  },
  tags: [String],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
DocumentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Document', DocumentSchema);
