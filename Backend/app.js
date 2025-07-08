const express = require('express');
const app = express();
const cors = require('cors');
const connectMongoDB = require('./config/mongodb');
const productRoute = require('./routes/productsRoute');
const indexRoute = require('./routes/indexRoute');
const userRoute = require('./routes/userRoute');
const cartRoute = require('./routes/cartRoute');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = process.env.PORT || 4000;

const allowedOrigins = ["http://localhost:3000"];

app.use(cookieParser())
app.use(express.json());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

connectMongoDB();
app.use('/products', productRoute);
app.use("/", indexRoute);
app.use("/user", userRoute);
app.use("/cart", cartRoute);

app.listen(`${PORT}`, ()=>{
    console.log(`Server is running on port ${PORT}`);
});