module.exports = {
  // Ensure user is authenticated
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'Please log in to view this resource');
    res.redirect('/users/login');
  },
  
  // Ensure user is NOT authenticated (for login/register pages)
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/recipes');
  },

  // Check if user is the author of a recipe
  checkRecipeOwnership: async function(req, res, next) {
    if (req.isAuthenticated()) {
      try {
        const Recipe = require('../models/recipe');
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
          req.flash('error', 'Recipe not found');
          return res.redirect('back');
        }
        
        // Check if user owns the recipe
        if (recipe.author.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have permission to do that');
          res.redirect('back');
        }
      } catch (err) {
        req.flash('error', 'Something went wrong');
        res.redirect('back');
      }
    } else {
      req.flash('error', 'You need to be logged in to do that');
      res.redirect('/users/login');
    }
  }
};