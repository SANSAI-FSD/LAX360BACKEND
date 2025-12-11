import express from "express";
import User from "../models/User.js";

import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// Get ALL users
// router.get("/users", isAdmin, async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// });

router.get("/users", isAdmin, async (req, res) => {
  const users = await User.find();
  res.json({
    success: true,
    data: users
  });
});


// Delete user
// router.delete("/users/:id", isAdmin, async (req, res) => {
//   await User.findByIdAndDelete(req.params.id);
//   res.json({ message: "User deleted" });
// });

router.delete("/users/:id", isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({
    success: true,
    message: "User deleted"
  });
});

// Update user
router.put("/users/:id", isAdmin, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});



export default router;
