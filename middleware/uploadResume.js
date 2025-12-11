import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    allowed_formats: ["pdf"],
    resource_type: "raw", // important for PDF files
  },
});

const uploadResume = multer({ storage: storage });

export default uploadResume;
