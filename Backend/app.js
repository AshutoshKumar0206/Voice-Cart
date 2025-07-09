const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectMongoDB = require('./config/mongodb');
const productRoute = require('./routes/productsRoute');
const indexRoute = require('./routes/indexRoute');
const userRoute = require('./routes/userRoute');
const cartRoute = require('./routes/cartRoute');
const voiceRoute = require('./routes/voiceRoute');

const PORT = process.env.PORT || 4000;

const allowedOrigins = ['https://walmart-sparkathon-eight.vercel.app', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

connectMongoDB();

app.use('/products', productRoute);
app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/cart', cartRoute);
app.use('/voice', voiceRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
