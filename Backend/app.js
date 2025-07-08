const express = require('express');
const app = express();
const cors = require('cors');
const connectMongoDB = require('./config/mongodb');
const productRoute = require('./routes/productsRoute');
const indexRoute = require('./routes/indexRoute');
const userRoute = require('./routes/userRoute');
const cartRoute = require('./routes/cartRoute');
const voiceRoute = require('./routes/voiceRoute');
require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

connectMongoDB();
app.use('/products', productRoute);
app.use("/", indexRoute);
app.use("/user", userRoute);
app.use("/cart", cartRoute);
app.use("/voice", voiceRoute);

app.listen(`${PORT}`, ()=>{
    console.log(`Server is running on port ${PORT}`);
});