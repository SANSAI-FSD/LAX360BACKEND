import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      
    });

    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ message: "Error registering user , User already exits try with different details", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name }); // find by name
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  req.session.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  res.json({ message: "Logged in", user: req.session.user });
});


// Get current user
router.get("/me", isAuthenticated, (req, res) => {
  res.json(req.session.user);
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});


// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE USER
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
export default router;

