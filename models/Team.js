import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },          // Designer, Developer, etc.
    skills: [{ type: String }],                      // optional array of skills
    imageUrl: { type: String },                      // optional image
    socialLinks: {
      linkedin: { type: String },
      github: { type: String },
      instagram: { type: String }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
