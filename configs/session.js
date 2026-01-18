import MongoStore from "connect-mongo";
import session from "express-session";

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "mg",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: "sessions",
    ttl: 2 * 24 * 60 * 60, // 2 days in seconds
  }),
  cookie: { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true, secure: false },
  rolling: true,
});
