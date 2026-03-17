import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true,
    },
    sourceType: { type: String, enum: ['api', 'user'], required: true },
    //   if sourceType is 'api'
    apiId: { type: String },
    title: { type: String },
    imageUrl: { type: String },
    category: { type: String },
    //   if sourceType is 'user':
    recipeId: { type: mongoose.ObjectId, ref: 'Recipe' },
  },
  { timestamps: true },
);

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
