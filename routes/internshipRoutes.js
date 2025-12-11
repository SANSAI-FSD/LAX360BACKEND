import express from "express";
import Internship from "../models/Internship.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * PUBLIC: Apply for internship
 * POST /api/internships
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, domain, resumeUrl } = req.body;

    if (!name || !email || !domain) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const application = await Internship.create({
      name,
      email,
      phone,
      domain,
      resumeUrl
    });

    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN: List all internship applications
 * GET /api/internships
 */
router.get("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { status, domain } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (domain) filter.domain = domain;

    const applications = await Internship.find(filter).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN: Update application status
 * PATCH /api/internships/:id/status
 */
router.patch("/:id/status", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Internship.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Status updated", application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN: Delete an internship application
 * DELETE /api/internships/:id
 */
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Internship.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
