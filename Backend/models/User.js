const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone:{type: String, required:false, unique:true},
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
});

// Remove the password hashing middleware
// Just save the password as is without modification
// No need for any "pre" hook for password hashing

module.exports = mongoose.model("User", UserSchema);
