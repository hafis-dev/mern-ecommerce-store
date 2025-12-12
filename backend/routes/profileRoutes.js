const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/profileController");

router.get("/me", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);
router.put("/password", authMiddleware, changePassword);

module.exports = router;
