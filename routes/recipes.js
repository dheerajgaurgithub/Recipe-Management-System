const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const User = require('../models/user');
const { ensureAuthenticated, checkRecipeOwnership } = require('../middleware/auth');

// INDEX - Get all recipes
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('author', 'username');
    res.render('recipes/index', { 
      recipes,
      title: 'All Recipes',
      user: req.user
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to retrieve recipes');
    res.redirect('/');
  }
});

// NEW - Show form to create new recipe
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('recipes/new', { 
    title: 'Add New Recipe',
    user: req.user
  });
});

// CREATE - Add new recipe to database
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { dishName, ingredients, cookingTime, difficulty, instructions } = req.body;
    
    // Create new recipe
    const newRecipe = new Recipe({
      dishName,
      ingredients,
      cookingTime,
      difficulty,
      instructions,
      author: req.user._id
    });
    
    // Save recipe
    const savedRecipe = await newRecipe.save();
    
    // Add recipe to user's recipes array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { recipes: savedRecipe._id }
    });
    
    req.flash('success', 'Recipe added successfully');
    res.redirect(`/recipes/${savedRecipe._id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to add recipe');
    res.redirect('/recipes/new');
  }
});

// SHOW - Show details of one recipe
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username');
    
    if (!recipe) {
      req.flash('error', 'Recipe not found');
      return res.redirect('/recipes');
    }
    
    res.render('recipes/show', { 
      recipe,
      title: recipe.dishName,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to retrieve recipe');
    res.redirect('/recipes');
  }
});

// EDIT - Show form to edit recipe
router.get('/:id/edit', checkRecipeOwnership, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.render('recipes/edit', { 
      recipe,
      title: `Edit ${recipe.dishName}`,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to retrieve recipe for editing');
    res.redirect('/recipes');
  }
});

// UPDATE - Update recipe in database
router.put('/:id', checkRecipeOwnership, async (req, res) => {
  try {
    const { ingredients, cookingTime, difficulty, instructions } = req.body;
    
    // Update recipe
    await Recipe.findByIdAndUpdate(req.params.id, {
      ingredients,
      cookingTime,
      difficulty,
      instructions
    });
    
    req.flash('success', 'Recipe updated successfully');
    res.redirect(`/recipes/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update recipe');
    res.redirect(`/recipes/${req.params.id}/edit`);
  }
});

// DELETE - Delete recipe from database
router.delete('/:id', checkRecipeOwnership, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    // Remove recipe from user's recipes array
    await User.findByIdAndUpdate(recipe.author, {
      $pull: { recipes: req.params.id }
    });
    
    // Delete recipe
    await Recipe.findByIdAndDelete(req.params.id);
    
    req.flash('success', 'Recipe deleted successfully');
    res.redirect('/recipes');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete recipe');
    res.redirect('/recipes');
  }
});

module.exports = router;