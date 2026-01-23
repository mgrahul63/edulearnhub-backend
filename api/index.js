import microCors from "micro-cors";
import { connectDB } from "../db/DBconnect.js";
import { createApp } from "./app.js";

await connectDB();
const app = createApp();

const cors = microCors({
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  origin: ["https://edulearnhub.vercel.app", "http://localhost:5173"],
  allowCredentials: true,
});

export default cors((req, res) => app(req, res));
