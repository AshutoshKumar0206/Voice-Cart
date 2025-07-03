const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    const mongoConnection = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${mongoConnection.connection.host}`);
  } catch (error) {
    success:false;
    message:"Unable to connect to MongoDB";
  }
};

module.exports = connectDB;
