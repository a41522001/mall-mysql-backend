import { Router } from 'express';
import { addCart, getCart } from '../controllers/cartController.ts';
const router = Router();
router.get('/getCart', getCart);
router.post('/addCart', addCart);
export default router;