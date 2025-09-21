const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");


dotenv.config();
const app = express();
app.use(cors({
  origin: [process.env.CLIENT_PORT, process.env.ADMIN_PORT], // your React frontend
  credentials: true // allow cookies
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Routes
const authRoutes = require("./routes/authRoutes");
const musicRoutes = require("./routes/musicRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);
app.use("/uploads", express.static("uploads"));


// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
