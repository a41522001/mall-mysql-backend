import { Router } from "express";
import { getProduct, addProduct, addProductImage, getSellProduct } from '../controllers/productController.ts';
import { upload } from '../middleware/uploadFile.ts';
const router = Router();
router.post('/addProduct', addProduct);
router.post('/addProductImage', upload.single('file'), addProductImage);
router.get('/getProduct', getSellProduct)
export default router;