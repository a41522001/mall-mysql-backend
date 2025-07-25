import { Router } from 'express';
import { addOrder, getOrder, getSingleOrderDetail, cancelOrder } from '../controllers/orderController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { getAllOrderValidate, getSingleOrderValidate, addOrderValidate, cancelOrderValidate } from '../utils/validate/orderValidate.js';
const router = Router();
router.post('/addOrder', validateRequest(addOrderValidate, 'body'), addOrder);
router.get('/getOrder/:userId', validateRequest(getAllOrderValidate, 'params'), getOrder);
router.post('/getSingleOrderDetail', validateRequest(getSingleOrderValidate, 'body'), getSingleOrderDetail);
router.post('/cancelOrder', validateRequest(cancelOrderValidate, 'body'), cancelOrder);
export default router;