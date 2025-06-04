import { Router } from "express";
import { getProduct, addProduct, addProductImage } from '../controllers/productController.js';
const router = Router();
router.get('/', getProduct);
export default router;