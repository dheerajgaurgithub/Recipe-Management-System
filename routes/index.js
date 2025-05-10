const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// Home page
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Recipe Management System',
    user: req.user
  });
});

module.exports = router;