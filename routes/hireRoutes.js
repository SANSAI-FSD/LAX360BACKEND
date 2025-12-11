import express from "express";
import HireRequest from "../models/HireRequest.js";
import uploadResume from "../middleware/uploadResume.js";

const router = express.Router();

// POST — Submit form with Cloudinary resume upload
router.post("/hire", uploadResume.single("resume"), async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    const newRequest = await HireRequest.create({
      name,
      email,
      phone,
      role,
      resumeUrl: req.file.path, // Cloudinary URL
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      data: newRequest,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET — Admin fetch all applications
router.get("/hire", async (req, res) => {
  try {
    const applications = await HireRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE — Admin delete application
router.delete("/hire/:id", async (req, res) => {
  try {
    await HireRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
