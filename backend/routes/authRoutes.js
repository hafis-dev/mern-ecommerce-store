const {  refreshToken, logoutUser, forgotPassword, registerUser, loginUser,resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = require('express').Router();

router.post('/register',registerUser);

// Auth Routes
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken); 
router.post("/logout", protect, logoutUser);

// Password Reset / Forgot Password
router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

module.exports = router;