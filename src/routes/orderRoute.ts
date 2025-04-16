import { Router } from 'express';
import { addOrder, getOrder } from '../controllers/orderController.ts';
const router = Router();
router.post('/addOrder', addOrder);
router.get('/getOrder', getOrder);
export default router;