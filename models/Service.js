import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String },
    price: { type: Number, default: 0 },
    imageUrl: { type: String }
  },
  {
    timestamps: true  // ✅ this auto-adds createdAt & updatedAt
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
