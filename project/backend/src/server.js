/**
 * server.js - Entry point that boots the Express app and connects to MongoDB
 */
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import errorHandler from './middlewares/errorHandler.js';
import healthRouter from './routes/health.routes.js';
import peopleRouter from './routes/people.routes.js';
import speechRouter from './routes/speech.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/people', peopleRouter);
app.use('/speech', speechRouter);

// Error handler (must be last)
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✓ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`✓ Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('✗ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
