// server/api/auth.js
import serverless from "serverless-http"; 
import { createApp } from "../utils/createApp.js";
import { connectDB } from "../db/DBconnect.js";

await connectDB();

const app = createApp();

export const handler = serverless(app);
