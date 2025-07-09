const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const allowedOrigins = [
  'https://walmart-sparkathon-eight.vercel.app',
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight support

app.use(cookieParser());
app.use(express.json());

// Logging for debug
app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  next();
});

// Your routes
const productRoute = require('./routes/productsRoute');
const indexRoute = require('./routes/indexRoute');
const userRoute = require('./routes/userRoute');
const cartRoute = require('./routes/cartRoute');
const voiceRoute = require('./routes/voiceRoute');

app.use('/products', productRoute);
app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/cart', cartRoute);
app.use('/voice', voiceRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
