import mongoose from "mongoose";

const hireRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    role: { type: String, required: true },
    resumeUrl: { type: String, required: true }, // resumes stored in cloudinary
  },
  { timestamps: true }
);

export default mongoose.model("HireRequest", hireRequestSchema);
