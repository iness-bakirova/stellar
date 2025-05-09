const express = require("express");
const { registerUser, loginUser, getUserProfile, updateProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { upload, handleUploadError } = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);   // Register User
router.post("/login", loginUser);         // Login User
router.get("/profile", protect, getUserProfile);  // Get User Profile

// Обновление профиля
router.put("/update-profile", protect, updateProfile);

router.post("/upload-image", upload.single("image"), handleUploadError, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ imageUrl: req.file.path });
});

module.exports = router;
