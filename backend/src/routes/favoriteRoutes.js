import express from 'express';
import Favorite from '../models/Favorite.js';
import protectRoute from '../middleware/auth.middleware.js';

const router = express.Router();

// Route for creating a new favorite recipe
router.post('/', protectRoute, async (req, res) => {
  try {
    const { sourceType, apiId, recipeId, imageUrl, category, title } = req.body;
    const favorite = new Favorite({
      sourceType,
      apiId: sourceType === 'api' ? apiId : undefined,
      recipeId: sourceType === 'user' ? recipeId : undefined,
      title,
      imageUrl,
      category,
      userId: req.user._id,
    });
    console.log(favorite);

    await favorite.save();

    res.status(201).json({
      favorite: {},
    });
  } catch (error) {
    console.log('Error in favorite route', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for getting all favorite recipes for a user
router.get('/', protectRoute, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).populate(
      'recipeId',
    );
    res.status(200).json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for deleting a favorite recipe
router.delete('/:favoriteId', protectRoute, async (req, res) => {
  try {
    const { favoriteId } = req.params;

    await Favorite.findByIdAndDelete(favoriteId);

    res.status(200).json({ message: 'Favorite deleted successfully' });
  } catch (error) {
    console.log('Error in favorite route', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
