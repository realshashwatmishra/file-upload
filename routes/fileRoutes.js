const express = require('express');
const router = express.Router();
const File = require('../models/file');
const upload = require('../middleware/upload');
const fs = require('fs').promises;
const path = require('path');
const createError = require('http-errors');

// Upload file
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw createError(400, 'No file uploaded');
    }

    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    await file.save();
    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        filename: file.originalName,
        size: file.size,
        mimeType: file.mimeType,
        uploadedAt: file.uploadedAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// Download file
router.get('/download/:id', async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      throw createError(404, 'File not found');
    }

    res.download(file.path, file.originalName);
  } catch (error) {
    next(error);
  }
});

// Delete file
router.delete('/:id', async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      throw createError(404, 'File not found');
    }

    // Delete file from filesystem
    await fs.unlink(file.path);
    
    // Delete metadata from database
    await file.delete();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get all files (metadata only)
router.get('/', async (req, res, next) => {
  try {
    const files = await File.find({}, {
      _id: 1,
      originalName: 1,
      size: 1,
      mimeType: 1,
      uploadedAt: 1
    });
    res.json(files);
  } catch (error) {
    next(error);
  }
});

module.exports = router;