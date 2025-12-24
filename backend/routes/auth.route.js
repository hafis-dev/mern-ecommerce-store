const {
  refreshToken,
  logoutUser,
  forgotPassword,
  registerUser,
  loginUser,
  resetPassword,
} = require("../controllers/auth.controller");

const { authMiddleware } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", authMiddleware, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
