import { Router } from "express";
import { signup, login, userInfo } from '../controllers/authController.ts';
const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/userInfo", userInfo);
export default router;