import express from "express";
import Team from "../models/Team.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * PUBLIC: Get all team members
 * GET /api/team
 */
router.get("/", async (req, res) => {
  try {
    const members = await Team.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN: Add a team member
 * POST /api/team
 */
router.post("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { name, role, skills, imageUrl, socialLinks } = req.body;

    const member = await Team.create({
      name,
      role,
      skills,
      imageUrl,
      socialLinks
    });

    res.status(201).json({ message: "Team member added", member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN: Update team member
 * PUT /api/team/:id
 */
router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const updated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Member not found" });

    res.json({ message: "Team member updated", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN: Delete team member
 * DELETE /api/team/:id
 */
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const deleted = await Team.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Member not found" });

    res.json({ message: "Team member deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
