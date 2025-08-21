import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/connectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";


const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

// enable JSON parsing
app.use(express.json());


app.get("/", (req, res) => res.send("Hello World!"));

// start server after DB connection
(async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () =>
      console.log(`Money Kiwi backend listening on port ${PORT}`)
    );

    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();