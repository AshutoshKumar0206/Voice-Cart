import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectMongoDB from "./config/mongodb.js";
import { cloudinaryConnect } from "./config/cloudinary.js";
import productRoute from "./routes/productsRoute.js";
import orderRoute from "./routes/orderRoute.js";
import indexRoute from "./routes/indexRoute.js";
import userRoute from "./routes/userRoute.js";
import cartRoute from "./routes/cartRoute.js";
import voiceRoute from "./routes/voiceRoute.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import "./utils/queue.js"; // Initialize queue

dotenv.config();

const allowedOrigins = ['https://voicecartapp.vercel.app', 'http://localhost:3000'];

const app = express();

app.use(cookieParser())
app.use(express.json());

const corsOptions = {
    origin: allowedOrigins,
    credentials: true, // if you're using cookies or authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectMongoDB();
cloudinaryConnect();
app.use('/products', productRoute);
app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/cart', cartRoute);
app.use('/voice', voiceRoute);
app.use('/order', orderRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
