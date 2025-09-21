const mongoose = require("mongoose");

const MusicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    genre: { type: String, required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: { createdAt: 'uploadedAt', updatedAt: 'updatedAt' } }  // Add custom timestamp fields
);

module.exports = mongoose.model("Music", MusicSchema);
