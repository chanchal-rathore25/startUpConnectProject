const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const VALID_ROLES = ["developer", "founder", "investor"];

async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password aur role zaroori hai." });
    }
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: "Role sirf developer, founder ya investor ho sakta hai." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password kam se kam 6 characters ka hona chahiye." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Ye email already registered hai. Login try karo." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    const token = generateToken(user._id);
    res.status(201).json({ user: user.toPublicJSON(), token });
  } catch (err) {
    res.status(500).json({ message: "Signup fail ho gaya.", error: err.message });
  }
}

// async function login(req, res) {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email aur password zaroori hai." });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
//     if (!user) return res.status(401).json({ message: "Email ya password galat hai." });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Email ya password galat hai." });

//     const token = generateToken(user._id);
//     res.json({ user: user.toPublicJSON(), token });
//   } catch (err) {
//     res.status(500).json({ message: "Login fail ho gaya.", error: err.message });
//   }
// }
async function login(req, res) {
  try {
    const { email, password } = req.body;

    console.log("Email:", email);

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    console.log("User:", user);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match:", isMatch);

    const token = generateToken(user._id);

    console.log("Token:", token);

    res.json({
      user: user.toPublicJSON(),
      token,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = { signup, login };