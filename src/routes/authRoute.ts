import { Router } from 'express';
import { signup, login, userInfo } from '../controllers/authController.js';
import { loginValidate, signupValidate } from '../utils/validate/authValidate.js';
import { validateRequest } from '../middleware/validateRequest.js';
const router = Router();
router.post('/signup', validateRequest(signupValidate, 'body'), signup);
router.post('/login', validateRequest(loginValidate, 'body'), login);
router.get('/userInfo', userInfo);
export default router;
