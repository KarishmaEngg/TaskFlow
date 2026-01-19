const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // Email ke liye zaroori hai
const User = require("../models/User");
const router = express.Router();

// 1. REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userName = name || email.split('@')[0]; 

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: userName, email, password: hashed });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. FORGOT PASSWORD ROUTE (Ab email error nahi aayega)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist." });
    }

   const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset - TaskFlow Pro",
      html: `<h3>Hello ${user.name},</h3>
             <p>Click the link below to reset your password:</p>
             <a href="http://localhost:3000/reset-password/${user._id}">Reset Password</a>`
    };

    // Yahan await lagana zaroori hai
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent to your email!" });

  } catch (err) {
    console.error("Mail Error:", err.message); // Console check karein error kya hai
    res.status(500).json({ message: "Failed to send email. Check your SMTP settings." });
  }
});

module.exports = router;