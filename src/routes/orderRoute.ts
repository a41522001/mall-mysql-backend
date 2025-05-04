import { Router } from 'express';
import { addOrder, getOrder, getSingleOrderDetail } from '../controllers/orderController.ts';
const router = Router();
router.post('/addOrder', addOrder);
router.get('/getOrder/:userId', getOrder);
router.post('/getSingleOrderDetail', getSingleOrderDetail);
export default router;