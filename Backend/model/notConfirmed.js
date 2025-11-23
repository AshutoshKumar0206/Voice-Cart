import mongoose from "mongoose";

const NotConfirmedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL index — auto delete after 300 seconds
NotConfirmedSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export default mongoose.model("NotConfirmed", NotConfirmedSchema);
