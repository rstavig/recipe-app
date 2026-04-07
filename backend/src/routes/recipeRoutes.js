import express from 'express';
import Recipe from '../models/Recipe.js';
import protectRoute from '../middleware/auth.middleware.js';

const router = express.Router();

// Route for creating a new recipe
router.post('/', protectRoute, async (req, res) => {
  try {
    const {
      title,
      category,
      prepTime,
      cookTime,
      servings,
      description,
      ingredients,
      instructions,
      imageUrl,
    } = req.body;

    const recipe = new Recipe({
      title,
      category,
      prepTime,
      cookTime,
      servings,
      description,
      ingredients,
      instructions,
      imageUrl,
      userId: req.user._id,
    });

    await recipe.save();

    res.status(201).json({
      recipe: {
        id: recipe._id,
        title: recipe.title,
        category: recipe.category,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        imageUrl: recipe.imageUrl,
        userId: recipe.userId,
        createdAt: recipe.createdAt,
      },
    });
  } catch (error) {
    console.log('Error in recipe route', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for getting all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json({ recipes });
  } catch (error) {
    console.log('Error in recipe route', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Route for getting all recipes for a user
router.get('/mine', protectRoute, async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user._id });
    res.status(200).json({
      recipes,
    });
  } catch (error) {
    console.log('Error in recipe route', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for getting a single recipe by ID
router.get('/:id', protectRoute, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ recipe });
  } catch (error) {
    console.log('Error in recipe route', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for updating a recipe by ID
router.put('/:id', protectRoute, async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ recipe: updatedRecipe });
  } catch (error) {
    console.log('Error in recipe route', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for deleting a recipe by ID
router.delete('/:id', protectRoute, async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.log('Error in recipe route', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
