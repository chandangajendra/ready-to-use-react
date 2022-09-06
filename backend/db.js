const mongoose = require('mongoose');

require("dotenv").config({ path: "./config.env" });
const mongoURI = process.env.ATLAS_URI;


const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("mongo db se connect ho gaya hai");
    })
}

module.exports = connectToMongo;

