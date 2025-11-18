const {  refreshToken, logoutUser, forgotPassword, registerUser, loginUser } = require('../controllers/authController');

const router = require('express').Router();

router.post('/register',registerUser);

router.post('/login', loginUser); 
router.post("/refresh", refreshToken); 
router.post("/logout",logoutUser);
router.post('/forgotPassword',forgotPassword)
module.exports = router;