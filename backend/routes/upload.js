const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const { detectPattern } = require('../utils/patternDetector');
const Pattern = require('../models/Pattern');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// Upload endpoint with pattern detection
router.post('/csv', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File uploaded:', req.file.filename);
    console.log('Detecting patterns...');

    // Detect pattern in the uploaded file
    const patternResult = await detectPattern(req.file.path);
    
    console.log('Pattern detected:', patternResult);

    // Save pattern to database
    const pattern = new Pattern({
      userId: req.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      patternType: patternResult.patternType,
      confidence: patternResult.confidence,
      dataPoints: patternResult.dataPoints,
      summary: patternResult.summary
    });

    await pattern.save();

    res.json({
      message: 'File uploaded and analyzed successfully!',
      pattern: {
        type: patternResult.patternType,
        confidence: (patternResult.confidence * 100).toFixed(0) + '%',
        dataPoints: patternResult.dataPoints
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Get user's patterns
router.get('/patterns', authMiddleware, async (req, res) => {
  try {
    const patterns = await Pattern.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(patterns);
  } catch (error) {
    console.error('Error fetching patterns:', error);
    res.status(500).json({ message: 'Failed to fetch patterns' });
  }
});

module.exports = router;