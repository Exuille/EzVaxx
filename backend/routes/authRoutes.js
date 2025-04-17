import express from 'express';
import {register, login, protect, logout, fetchUser, updatePass} from '../controllers/authController.js';

const router = express.Router()

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(protect, logout);
router.route("/fetch").get(protect, fetchUser);
router.route("/update/password").post(protect, updatePass)

export default router;