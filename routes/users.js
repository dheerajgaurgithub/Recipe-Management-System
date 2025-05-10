const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const { forwardAuthenticated } = require('../middleware/auth');

// Register form
router.get('/register', forwardAuthenticated, (req, res) => {
  res.render('users/register', { 
    title: 'Register',
    user: req.user
  });
});

// Register process
router.post('/register', forwardAuthenticated, async (req, res) => {
  try {
    const { username, password, confirmPassword, fullName, country, dietaryPreference } = req.body;
    
    // Validation
    const errors = [];
    
    if (password !== confirmPassword) {
      errors.push({ msg: 'Passwords do not match' });
    }
    
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
    
    if (errors.length > 0) {
      return res.render('users/register', {
        errors,
        username,
        fullName,
        country,
        dietaryPreference,
        title: 'Register',
        user: req.user
      });
    }
    
    // Check if username exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      errors.push({ msg: 'Username already exists' });
      return res.render('users/register', {
        errors,
        username,
        fullName,
        country,
        dietaryPreference,
        title: 'Register',
        user: req.user
      });
    }
    
    // Create new user
    const newUser = new User({
      username,
      password,
      fullName,
      country,
      dietaryPreference
    });
    
    // Save user
    await newUser.save();
    
    req.flash('success', 'You are now registered and can log in');
    res.redirect('/users/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed');
    res.redirect('/users/register');
  }
});

// Login form
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('users/login', { 
    title: 'Login',
    user: req.user
  });
});

// Login process
router.post('/login', passport.authenticate('local', {
  successRedirect: '/recipes',
  failureRedirect: '/users/login',
  failureFlash: true
}));

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
  });
});

module.exports = router;