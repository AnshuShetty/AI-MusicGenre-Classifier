const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const nodemailer = require("nodemailer");
const twilio = require("twilio");
require("dotenv").config();

// 🧠 In-memory store for verification codes
const verificationStore = new Map();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const {
  TWILIO_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE,
} = process.env;

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

// Temporary in-memory store (Use Redis in production)
const otpStore = {};


router.post("/register", async (req, res) => {
  const { username, email, phone, password, role } = req.body;

  // Validate phone only for customers
  if (role !== 'admin' && !phone) {
    return res.status(400).json({ error: "Phone number is required for customers" });
  }

  try {
    const user = new User({ username, email, phone, password, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//user login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });
  
      // Direct password comparison (no hashing)
      if (user.password !== password) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1m" });
      res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Set to false in development if not using HTTPS
      sameSite: "Strict",
      maxAge: 60 * 1000 // 1 minute
      });
      res.status(200).json({ token, username: user.username, role: user.role });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  //login through email and verification code
router.post("/request-code", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Email not registered" });

    const code = Math.floor(100000 + Math.random() * 900000);

    await transporter.sendMail({
      from: `"Melodia" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Melodia Verification Code",
      text: `Your verification code is: ${code}`,
    });

    verificationStore.set(email, code.toString());
    setTimeout(() => verificationStore.delete(email), 5 * 60 * 1000); // Expires in 5 mins

    res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    console.error("Email send failed:", error);
    res.status(500).json({ error: "Failed to send verification code" });
  }
});


router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    const storedCode = verificationStore.get(email);
    if (!storedCode || storedCode !== code) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email not registered" });

    // Remove the code after successful verification
    verificationStore.delete(email);

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, { httpOnly: true })
      .json({
        message: "Logged in successfully",
        token,
        username: user.username,
        role: user.role,
      });
  } catch (err) {
    console.error("Verification failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 📤 Send OTP
router.post("/request-phone-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ error: "Phone is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = otp;

  try {
    await client.messages.create({
      body: `Your verification code is: ${otp}`,
      from: TWILIO_PHONE,
      to: phone,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ✅ Verify OTP
router.post("/verify-phone-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (otpStore[phone] !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // Clear used OTP
  delete otpStore[phone];

  // Find or create user
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone });
  }

  res.status(200).json({
    message: "Login successful",
    user: { id: user._id, phone: user.phone },
  });
});

// Admin login route
router.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find admin by username
        const admin = await User.findOne({ username });

        if (!admin) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Check if the provided password matches the stored password
        if (password !== admin.password) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Assume the role is 'admin' (you can modify this based on your User model if roles are dynamic)
        const role = admin.role; // Hardcoded for simplicity or you can use `admin.role` if it's in the User model

        // Create a JWT token with the role in the payload
        const token = jwt.sign(
            { id: admin._id, username: admin.username, role }, // Include role
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Set to false in development if not using HTTPS
      sameSite: "Strict",
      maxAge: 60 * 10000 // 1 minute
      });

        // Respond with the token, username and role
        return res.status(200).json({ token, role, username: admin.username });

    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
});

// Admin Dashboard route
router.get("/admin/dashboard",  (req, res) => {
    res.status(200).json({ message: "Welcome to the Admin Dashboard!" });
  });

module.exports = router;
