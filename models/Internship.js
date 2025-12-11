import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },       // applicant name
    email: { type: String, required: true },
    phone: { type: String },
    domain: { type: String, required: true },     // PCB, Web, Mobile, Graphic, etc
    resumeUrl: { type: String },                  // optional uploaded file
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Internship", internshipSchema);
