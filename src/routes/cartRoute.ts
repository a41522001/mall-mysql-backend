import { Router } from 'express';
import { addCart, getCart, changeCartQuantity, deleteCart } from '../controllers/cartController.ts';
const router = Router();
router.get('/getCart', getCart);
router.post('/addCart', addCart);
router.post('/changeCartQuantity', changeCartQuantity);
router.post('/deleteCart', deleteCart);
export default router;