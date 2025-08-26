import '../config/passportConfig.js';
import { registerUser } from "../services/authService.js";


export const register = async (req, res) => {
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
    const user = await registerUser(email, password);
    res.status(201).json(user);
  } catch (err) {
    if (err.code === "23505") {
      // unique_violation
      return res.status(409).json({ message: "Email already exists" });
    }
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};


