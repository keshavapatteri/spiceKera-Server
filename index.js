// import express from "express";

// import dotenv from "dotenv";
// import v1Router from "./Router/index.js";
// import connectdb from "./Config/Db.js";
// import cors from "cors";
// import cookieParser from 'cookie-parser';

// // Load environment variables
// dotenv.config();


// const app = express();
// app.use(express.json());
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });
// app.use(
//   cors({origin:'https://dsfsdg.vercel.app',  credentials: true})
//   );


// // 
// app.use(cookieParser());
// connectdb();

// app.use(express.json());

// // Define routes after middleware
//  app.use("/v1",v1Router);




// // Start the server
// const PORT = process.env.PORT || 3005;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

import express from "express";
import dotenv from "dotenv";
import v1Router from "./Router/index.js";
import connectdb from "./Config/Db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your actual frontend domain
    credentials: true,
  })
);

// https://spicekera.vercel.app

// Connect to database
connectdb();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Enable CORS



// Favicon fix: avoid 404 errors in logs
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/favicon.png", (req, res) => res.status(204).end());

// Test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// API Routes
app.use("/v1", v1Router);

// Start the server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
