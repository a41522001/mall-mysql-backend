import { Router } from "express";
import { checkout, checkoutNotify } from '../controllers/checkoutController.js';
import { validateRequest } from '../middleware/validateRequest.js';
const router = Router();
router.post('/checkout', checkout);
router.post('/checkoutNotify', checkoutNotify);
export default router;