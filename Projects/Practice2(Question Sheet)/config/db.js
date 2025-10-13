const mongoose = require('mongoose');
require('dotenv').config();
function connectDB(){
    try {
        mongoose.connect(process.env.urlDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected to the database successfully.");
} catch (error) {
    console.error("Database connection error:", error);
}
}
module.exports = connectDB;