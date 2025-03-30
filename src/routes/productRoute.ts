import { Router } from "express";
import { getProduct, addProduct } from '../controllers/productController';
const router = Router();
router.get('/getProduct', getProduct);
router.post('/addProduct', addProduct);
export default router;