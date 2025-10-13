const express = require("express");
require("dotenv").config();
const app = express();
const PORT = 3100;
app.use(express.json());

try {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
    console.log("Connected to MongoDB");
} catch (error) {
    console.log("Error connecting to MongoDB:", error);
}
