// workers/emailWorker.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import sendOtpMail from "../mail/sendOtpMailer.js";

const MONGO_URI = process.env.MONGO_URL;
if (!MONGO_URI) {
  console.error("MONGO_URI not set");
  process.exit(1);
}

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Worker connected to MongoDB");
  } catch (err) {
    console.error("Worker Mongo connection error:", err);
    process.exit(1);
  }
}
await connectDB();

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("Processing job", job.name, job.id, job.data);

    if (job.name === "sendOtp") {
      const { email, otp, name } = job.data;

      try {
        // send mail
        await sendOtpMail(email, otp, name);
        console.log(`OTP sent to ${email}`);
      } catch (err) {
        console.error("Error in sendOtp job:", err);
        throw err; // rethrow to allow retries
      }
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed`, err);
});

// graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down worker...");
  await worker.close();
  process.exit(0);
});
