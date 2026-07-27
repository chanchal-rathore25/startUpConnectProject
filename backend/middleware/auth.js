const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Login zaroori hai. Token nahi mila." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User nahi mila. Dobara login karo." });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid ya expire ho gaya. Dobara login karo." });
  }
}

module.exports = { protect };
