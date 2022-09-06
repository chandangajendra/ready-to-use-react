const express = require('express');
const app = express();
const connectToMongo = require('./db.js');
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

connectToMongo();
app.use(express.json());

// fetching fiels from route folder
app.use('/api/auth', require('./routes/auth'));
app.use('/api/note', require('./routes/note'));

// listing the response
app.listen(port, () => {
    console.log(`app ${port} port me chal rha hai `)
})