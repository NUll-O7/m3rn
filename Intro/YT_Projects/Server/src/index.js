import express from 'express';
import dotenv from 'dotenv';
import noteRoutes from './routes/noteRoutes.js';
import db from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use('/api/notes', noteRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

db();
