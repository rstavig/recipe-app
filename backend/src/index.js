import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import recipeRoutes from './routes/recipeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';

import { connectDB } from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Use built-in middleware to parse JSON and URL-encoded bodies
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

const allowedOrigins = [
  'https://grub-club.onrender.com', // Render static site
  'http://localhost:8081', // Expo web local dev (adjust port if needed)
];

app.use(
  cors({
    // origin: allowedOrigins,
    origin: '*', // Allow all origins for development; change to allowedOrigins in production
    credentials: true, // if you use cookies/auth
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/favorites', favoriteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
