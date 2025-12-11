import express from "express";
import ProjectRequest from "../models/ProjectRequest.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * PUBLIC: Create a new project request
 * POST /api/projects
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, serviceType, message } = req.body;

    if (!name || !email || !serviceType || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const project = await ProjectRequest.create({
      name,
      email,
      phone,
      serviceType,
      message
    });

    res.status(201).json({ message: "Project request created", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN: Get all project requests
 * GET /api/projects
 */
router.get("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const projects = await ProjectRequest.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN: Update project status
 * PATCH /api/projects/:id/status
 */
router.patch("/:id/status", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const project = await ProjectRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Status updated", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN: Delete a project request
 * DELETE /api/projects/:id
 */
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectRequest.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
