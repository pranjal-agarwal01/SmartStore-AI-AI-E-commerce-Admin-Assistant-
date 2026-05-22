const express = require('express');
const router = express.Router();
const { generateDescription, generateSeoTags, generateCaption, generateSuggestions } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/description', protect, generateDescription);
router.post('/seo-tags', protect, generateSeoTags);
router.post('/caption', protect, generateCaption);
router.get('/suggestions', protect, generateSuggestions);

module.exports = router;
