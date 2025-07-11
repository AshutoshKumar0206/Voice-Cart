const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectMongoDB = require('./config/mongodb');
const fileUpload = require('express-fileupload');
const { cloudinaryConnect } = require('./config/cloudinary');
const mongoose = require('mongoose');
const productRoute = require('./routes/productsRoute');
const indexRoute = require('./routes/indexRoute');
const userRoute = require('./routes/userRoute');
const cartRoute = require('./routes/cartRoute');
const voiceRoute = require('./routes/voiceRoute');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(
//     fileUpload({
//         useTempFiles:true,
// 		tempFileDir:"/tmp",
//         limits: { fileSize: 50 * 1024 * 1024 }
// 	})
// )

connectMongoDB();
cloudinaryConnect();
app.use('/products', productRoute);
app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/cart', cartRoute);
app.use('/voice', voiceRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
