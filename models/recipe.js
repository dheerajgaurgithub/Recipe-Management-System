const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  dishName: {
    type: String,
    required: [true, 'Dish name is required'],
    trim: true
  },
  ingredients: {
    type: String,
    required: [true, 'Ingredients are required'],
    trim: true
  },
  cookingTime: {
    type: Number,
    required: [true, 'Cooking time is required'],
    min: [1, 'Cooking time must be at least 1 minute']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
    default: 'Intermediate'
  },
  instructions: {
    type: String,
    required: [true, 'Instructions are required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Virtual for ingredients array
RecipeSchema.virtual('ingredientsList').get(function() {
  return this.ingredients.split(',').map(ingredient => ingredient.trim());
});

module.exports = mongoose.model('Recipe', RecipeSchema);