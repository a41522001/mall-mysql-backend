import { Router } from "express";
import { getProduct, addProduct, addProductImage } from '../controllers/productController.ts';
import { upload } from '../middleware/uploadFile.ts';
const router = Router();
router.get('/getProduct', getProduct);
router.post('/addProduct', addProduct);
router.post('/addProductImage', upload.single('file'), addProductImage);
export default router;