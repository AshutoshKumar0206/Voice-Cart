const express = require('express');
const app = express();
const connectMongoDB = require('./config/mongodb');
const productRoute = require('./routes/productsRoute');
const indexRoute = require('./routes/indexRoute');
const userRoute = require('./routes/userRoute');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
app.use(express.json());

connectMongoDB();
app.use('/products', productRoute);
app.use("/", indexRoute);
app.use("/user", userRoute);
app.listen(`${PORT}`, ()=>{
    console.log(`Server is running on port ${PORT}`);
});