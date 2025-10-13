const express = require("express");
const path = require("path");
const { configDotenv } = require("dotenv");
const app = express();
const connectDB = require("./config/db.js");
connectDB();

configDotenv();

const routes = require("./routes/route.js");
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use("/api", routes);
