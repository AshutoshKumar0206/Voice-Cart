const mongoose = require("mongoose");

const connectMongoDB =  () => {
  try {
        mongoose.connect(process.env.MONGO_URL).then(() => {
          console.log("connected to mongodb");
        }).catch((err) => {
            res.status(500).json({
              success:false,
              message:"Error in connecting to MongoDB"
        })
        })
    } catch (err) {
      res.status(500).json({
        success:false,
        message:"Error in Processing connection request"
	})
  }
}

module.exports = connectMongoDB;
