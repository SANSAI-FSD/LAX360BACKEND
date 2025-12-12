import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectDB from "./config/db.js";
import "dotenv/config";


import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import hireRoutes from "./routes/hireRoutes.js";
import enquiryRoutes from "./routes/enquiry.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// DB Connect
connectDB();

// Middlewares
app.use(express.json());

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       callback(null, origin); // allow all origins safely
//     },
//     credentials: true,
    
//   })
// );

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true); // allow mobile apps, Postman, React SSR
//       return callback(null, origin);            // allow frontend domains
//     },
//     credentials: true,
//   })
// );


// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://lax360frontend.onrender.com"
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true); // Postman / SSR / mobile apps
//       if (allowedOrigins.includes(origin)) return callback(null, origin);
//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//   })
// );



// ======== CORS FIX (works for all devices, mobile, desktop) ========

app.set('trust proxy', 1);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no-origin requests (mobile apps, Postman, local files)
      if (!origin) return callback(null, true);

      // Allow your frontend domains
      const allowedOrigins = [
        "http://localhost:5173",
        "https://lax360frontend.onrender.com"
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin);
      }

      // Allow everything else TEMPORARILY (mobile browsers)
      return callback(null, origin);
    },

    credentials: true,
  })
);


// ======== SESSION COOKIE FIX (mobile-friendly) ========
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/companyApp",
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: true,      // Required for HTTPS (Render)
      sameSite: "none",  // Required for cross-domain + mobile
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  })
);



// app.use(
//   session({
//     secret: "supersecretkey",
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/companyApp",
//       ttl: 14 * 24 * 60 * 60, // 14 days
//     }),
//     cookie: {
//       httpOnly: true,
//       maxAge: 14 * 24 * 60 * 60 * 1000,
//       secure: false, // true only in https
//       sameSite: "lax",
//     },
//   })
// );

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/companyApp",
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      secure: true,      // because Render backend uses HTTPS
      sameSite: "none",  // REQUIRED for Vercel/Netlify frontend
    },
  })
);


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/team", teamRoutes);
app.use("/api", hireRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/admin", adminRoutes);

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
