import bcrypt from "bcryptjs";
import pool from "../config/connectDB.js";

export const registerUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
    [email, hashedPassword]
  );
  return rows[0];
};