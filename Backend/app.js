const express = require('express');
const app = express();
const cors = require('cors');
const connectMongoDB = require('./config/mongodb');
const productRoute = require('./routes/productsRoute');
const indexRoute = require('./routes/indexRoute');
const userRoute = require('./routes/userRoute');
const cartRoute = require('./routes/cartRoute');
const voiceRoute = require('./routes/voiceRoute');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = process.env.PORT || 4000;

const allowedOrigins = ['https://walmart-sparkathon-eight.vercel.app', 'http://localhost:3000'];

app.use(cookieParser())
app.use(express.json());

const corsOptions = {
    origin: allowedOrigins,
    credentials: true, // if you're using cookies or authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use('*', cors(corsOptions));
connectMongoDB();
app.use('/products', productRoute);
app.use("/", indexRoute);
app.use("/user", userRoute);
app.use("/cart", cartRoute);
app.use("/voice", voiceRoute);

app.listen(`${PORT}`, ()=>{
    console.log(`Server is running on port ${PORT}`);
});