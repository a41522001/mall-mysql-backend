import { Router } from 'express';
import { addOrder, getOrder, getSingleOrderDetail, cancelOrder } from '../controllers/orderController.ts';
const router = Router();
router.post('/addOrder', addOrder);
router.get('/getOrder/:userId', getOrder);
router.post('/getSingleOrderDetail', getSingleOrderDetail);
router.post('/cancelOrder', cancelOrder);
export default router;