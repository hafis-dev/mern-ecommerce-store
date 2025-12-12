const {
  refreshToken,
  logoutUser,
  forgotPassword,
  registerUser,
  loginUser,
  resetPassword,
} = require("../controllers/authController");

const { authMiddleware } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", authMiddleware, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
