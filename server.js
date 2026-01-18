// import cookieParser from "cookie-parser";
// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import Stripe from "stripe";
// import connectDB from "./configs/mongodb.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// import userRouter from "./routes/userRoutes.js";

// dotenv.config();
// const app = express();
// const PORT = 4000;
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // CORS - credentials: true add kora hoyeche cookies er jonno
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   })
// );

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

// // Middleware: session setup
// app.use(
//   session({
//     // store: new DatabseName, -- by default server-side RAM store hoi, when server side restart then all session data remove auomatic so use database
//     secret: "mySecretKey", // session encrypt করার key
//     resave: false, // কোনো request এ session পরিবর্তন না হলে save হবে না
//     saveUninitialized: true, // নতুন session create হবে
//     cookie: {
//       secure: false, // HTTPS হলে true হবে
//       maxAge: 30 * 60 * 1000, // 30 মিনিট পরে session cookie expire হবে
//     },
//   })
// );

// // Routes
// app.use("/api/auth", userRouter);
// app.use("/api/payment", paymentRoutes); // Payment routes add kora hoyeche

// // Test route
// app.get("/", (req, res) => {
//   res.json({ message: "Backend running", success: true });
// });

// // Old payment route (if you need it for other products)
// // app.post('/create-checkout-session', async (req, res) => {
// //   try {
// //     const { product } = req.body;
// //     const session = await stripe.checkout.sessions.create({
// //       payment_method_types: ["card"],
// //       line_items: [
// //         {
// //           price_data: {
// //             currency: "usd",
// //             product_data: {
// //               name: product.name,
// //               images: [product.image],
// //             },
// //             unit_amount: product.price * 100,
// //           },
// //           quantity: 1,
// //         }
// //       ],
// //       mode: "payment",
// //       success_url: `${process.env.CLIENT_URL}/success`,
// //       cancel_url: `${process.env.CLIENT_URL}/cancel`,
// //     });
// //     res.json({ url: session.url });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// app.listen(PORT, () => {
//   connectDB();
//   console.log(`Server running on http://localhost:${PORT}`);
// });

import "dotenv/config";
import http from "http";
import { createApp } from "./app.js";
import { connectDB } from "./db/DBconnect.js";

const PORT = process.env.PORT || 4000;

//and http server
const app = createApp();
const server = http.createServer(app);

//Databse connection
await connectDB();

//Running the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
