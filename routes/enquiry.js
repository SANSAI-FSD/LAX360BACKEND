import express from "express";
import Enquiry from "../models/enquiry.js";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully!",
      data: enquiry,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET ALL (Admin)
router.get("/", async (req, res) => {
  try {
    const list = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
