import { Router } from "express";
import { checkout, checkoutNotify } from '../controllers/checkoutController.ts';
const router = Router();
router.post('/checkout', checkout);
router.post('/checkoutNotify', checkoutNotify);
export default router;