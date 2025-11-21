import express from 'express';
import passport from 'passport';
import {
    registerUser,
    loginUser,
    googleSuccess
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login"
    }),
    googleSuccess
);

export default router;