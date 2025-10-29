import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import path from "path"; // No longer needed as we aren't serving static files

import notesRoutes from "./routes/noteRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  'http://localhost:5173',
  process.env.NETLIFY_FRONTEND_URL 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, 
  })
);

app.use(express.json()); 
app.use(rateLimiter); 

app.use("/api/notes", notesRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
