import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import pool from './src/config/connectDB.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";


// Middleware
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());


app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0] }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// start server after DB connection
(async () => {
  try {
    // verify DB connection using exported pool
    await pool.query('SELECT 1');
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