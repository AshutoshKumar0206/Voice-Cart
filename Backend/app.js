const express = require('express');
const app = express();
const connectMongoDB = require('./config/mongodb');
const productRoute = require('./routes/productsRoute');
const index = require('./index');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
app.use(express.json());

connectMongoDB();
app.use('/api/v1/products', productRoute);
app.use("/", index);
app.listen(`${PORT}`, ()=>{
    console.log(`Server is running on port ${PORT}`);
});