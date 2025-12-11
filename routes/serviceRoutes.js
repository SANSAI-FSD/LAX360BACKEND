
import express from "express";
import Service from "../models/Service.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ----------------- ROUTES -----------------

// GET all services
router.get("/", async (req, res) => {
  try {
    const { q, category, limit = 20, skip = 0 } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
        { category: new RegExp(q, "i") },
      ];
    }

    if (category) filter.category = category;

    const services = await Service.find(filter)
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single service by ID or slug
router.get("/:idOrSlug", async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    const service = await Service.findOne({
      $or: [{ _id: idOrSlug }, { slug: idOrSlug }],
    });

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------
// ADMIN: Create service
// ---------------------
router.post("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description, category, slug } = req.body;

    // AUTO SLUG CREATION
    let finalSlug =
      slug ||
      title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");

    // Check if slug already exists
    const exists = await Service.findOne({ slug: finalSlug });
    if (exists) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    const service = await Service.create({
      title,
      description,
      category,
      slug: finalSlug,
    });

    res.status(201).json({ message: "Service created", service });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------
// ADMIN: Update service
// ---------------------
router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const service = await Service.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!service)
      return res.status(404).json({ message: "Service not found" });

    res.json({ message: "Service updated", service });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------
// ADMIN: Delete service
// ---------------------
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);
    if (!service)
      return res.status(404).json({ message: "Service not found" });

    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
