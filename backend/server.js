const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware

app.use(cors());
app.use(express.json());

//Basic test route

app.get('/', (req,res)=> {
    res.json({ message: 'PatternCraft API is running!'});
});

//Start Server

app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});