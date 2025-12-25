import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
  resumeReview
} from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

// 🔹 Text based
aiRouter.post("/generate-article", auth, generateArticle);
aiRouter.post("/generate-blog-titles", auth, generateBlogTitle);
aiRouter.post("/generate-images", auth, generateImage);

// 🔹 Image based
aiRouter.post(
  "/remove-image-background",
  auth,
  upload.single("image"),
  removeImageBackground
);

aiRouter.post(
  "/remove-image-object",
  auth,
  upload.single("image"),
  removeImageObject
);

// 🔹 Resume
aiRouter.post(
  "/resume-review",
  auth,
  upload.single("resume"),
  resumeReview
);

export default aiRouter;
