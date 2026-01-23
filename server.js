import dotenv from "dotenv";
import "dotenv/config";
import http from "http";
import { createApp } from "./app.js";
import { connectDB } from "./db/DBconnect.js";
dotenv.config();

const PORT = process.env.PORT || 4000;

//and http server
const app = createApp();
const server = http.createServer(app);
console.log("MONGO:", process.env.MONGODB_URL);
//Databse connection
await connectDB();

//Running the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
