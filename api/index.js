import { createApp } from "../app";
import { connectDB } from "../db/DBconnect";

// Connect MongoDB once
await connectDB();

// Create Express app
const app = createApp();

// Export as serverless function
export default (req, res) => app(req, res);
