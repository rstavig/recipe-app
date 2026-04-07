import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    prepTime: {
      type: Number,
    },
    cookTime: {
      type: Number,
    },
    servings: {
      type: Number,
    },
    description: {
      type: String,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    instructions: {
      type: [String],
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
