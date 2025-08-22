import express from "express";
import passport from 'passport';
import bcrypt from "bcryptjs";
import pool from "../config/connectDB.js";
import '../config/passport-config.js';

const router = express.Router();


// Register route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // Simple regex check for email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    // If email unique constraint fails, Postgres throws an error
    if (err.code === "23505") {
      // unique_violation
      return res.status(409).json({ message: "Email already exists" });
    }
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
});

// Login route
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ message: info.message || "Login failed" });
    }
    req.login(user, (err) => {
      if (err) return next(err);

      return res.json({ id: user.id, email: user.email });
    });
  })(req, res, next);
});

export default router;
