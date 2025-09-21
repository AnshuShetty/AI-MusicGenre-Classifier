// middleware.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];  // Assuming token is sent as "Bearer token"

  if (!token) {
    return res.status(401).json({ error: "Access Denied: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // If the token has expired or is invalid
      return res.status(401).json({ error: "Token expired or invalid" });
    }
    
    // Attach user info to the request object
    req.user = user;
    
    // Call the next middleware or route handler
    next();
  });
};

module.exports = authenticateToken;
