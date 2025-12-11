import mongoose from "mongoose";

const projectRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },        // client name
    email: { type: String, required: true },
    phone: { type: String },
    serviceType: { type: String, required: true }, // PCB, Web, Graphic, etc.
    message: { type: String, required: true },     // project details
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const ProjectRequest = mongoose.model("ProjectRequest", projectRequestSchema);

export default ProjectRequest;
