import { Router } from "express";
import { getProduct, addProduct, addProductImage } from '../controllers/productController.ts';
const router = Router();
router.get('/getProduct', getProduct);
export default router;