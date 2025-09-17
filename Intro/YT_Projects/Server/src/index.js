import express from 'express';
import dotenv from 'dotenv';
import noteRoutes from './routes/noteRoutes.js';
import db from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(rateLimiter);

//middleware to parse JSON
app.use(express.json());

app.use('/api/notes', noteRoutes);

db().then(() => {
  console.log('Connected to the database');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
