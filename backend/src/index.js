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
  'http://localhost:19006', // Expo web local dev (Expo default web port)
];

// Log the request origin for debugging
app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin);
  next();
});

// Use a function to dynamically check allowed origins
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log('Blocked by CORS:', origin);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/favorites', favoriteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
