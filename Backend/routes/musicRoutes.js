const express = require("express");
const Music = require("../models/Music");
const router = express.Router();
const multer = require("multer");
const authenticateToken = require('../middleware/middleware')
const verifyToken = require('../middleware/auth');

// Get all music
router.get("/all", verifyToken, async (req, res) => {
  try {
    const music = await Music.find();
    res.status(200).json(music);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });
  const upload = multer({ storage });
  
  // Upload music
  router.post("/upload", upload.single("file"), async (req, res) => {
    try {
      // Ensure file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      // Extract all required fields from req.body
      const { title, artist, album, genre } = req.body;
  
      // Validate all fields
      if (!title || !artist || !album || !genre) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Log the data for debugging
      console.log("Received data:", { title, artist, album, genre });
  
      // Create new music entry
      const newMusic = new Music({
        title,
        artist,
        album,
        genre,
        fileUrl: `/uploads/${req.file.filename}`, // Ensure file path consistency
      });
  
      // Save to the database
      await newMusic.save();
  
      res.status(201).json({ message: "Music uploaded successfully!" });
    } catch (error) {
      console.error("Error uploading music:", error.message);
      res.status(500).json({ error: "Error uploading music" });
    }
  });
  
  
  
  // Get all music (for admin)
  router.get("/list", async (req, res) => {
    try {
      const musicList = await Music.find();
      res.status(200).json(musicList);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Delete music
  router.delete("/:id", async (req, res) => {
    try {
      await Music.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Music deleted successfully!" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


  // Route to get music by genre
// Route to get music by genre
router.get("/albums/:genre", async (req, res) => {
    const { genre } = req.params;
    try {
      const musicList = await Music.find({ genre: genre }); // Fetch music by genre from the database
      res.status(200).json(musicList); // Send the list of music to the frontend
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;
