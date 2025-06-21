const express = require('express');
const router = express.Router();
const { Login, Sign,GetSession,Logout,getRoles,profileData} = require('../Controllers/Login');
const { requestPasswordReset, verifyOtpAndResetPassword, verifyEmailOtp } = require('../Controllers/Vertify.email.otp');
const {verifyToken}=require("../Controllers/Auth.webtoken");
router.post('/login', Login);
router.post('/register', Sign);
router.get("/session",GetSession);
router.post("/logout",Logout);
router.get("/role",getRoles);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', verifyOtpAndResetPassword);
router.post('/verify-email-otp', verifyEmailOtp);

//dashboardbased
router.get("/das/profile",verifyToken,profileData);
module.exports = router;