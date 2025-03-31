import { Router } from "express";
import { getProduct, addProduct, addProductImage } from '../controllers/productController';
import { upload } from '../middleware/uploadFile';
const router = Router();
router.get('/getProduct', getProduct);
router.post('/addProduct', addProduct);
router.post('/addProductImage', upload.single('file'), addProductImage);
export default router;