const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/profile.controller");

router.get("/me", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);
router.put("/password", authMiddleware, changePassword);

module.exports = router;
