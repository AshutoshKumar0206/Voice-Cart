// config/redis.js
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const options = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  username: process.env.REDIS_USERNAME || undefined,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // recommended for BullMQ
};

// enable TLS for managed Redis if requested
if (process.env.REDIS_TLS === "true") {
  options.tls = {};
}

export const redisConnection = options;

// optional direct client if needed elsewhere
export const redisClient = new Redis(options);

redisClient.on("connect", () => console.log("Redis client connecting..."));
redisClient.on("ready", () => console.log("Redis ready"));
redisClient.on("error", (err) => console.error("Redis error:", err));
