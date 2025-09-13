import express from "express";
import passport from "passport";
import { register } from "../controllers/authController.js";

const router = express.Router();


router.post("/register", register);

// Login route using passport local strategy
router.post(
  "/login",
  passport.authenticate("local", { session: true }),
  (req, res) => {
     const { id, email, home_country } = req.user;
      res.status(200).json({
      message: "Login successful",
      user: { id, email, home_country }
    });
  }
);

export default router;