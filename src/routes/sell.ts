import { Router } from 'express';
import { getProduct, addProduct, addProductImage, getSellProduct, changeProductIsActive, modifyProduct } from '../controllers/productController.js';
import { getDateItem, getSellCount, getSellOrderDetail, getSellOrders, getSumData, sellDeliver, cancelOrder } from '../controllers/sellController.js';
import { upload } from '../middleware/uploadFile.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { addProductValidate, changeProductIsActiveValidate } from '../utils/validate/productValidate.js';
import {
  getDateItemValidate,
  getSumDataValidate,
  sellDeliverValidate,
  getSellOrderDetailValidate,
  cancelOrderValidate,
} from '../utils/validate/sellValidate.js';
const router = Router();

router.get('/product', getSellProduct);
router.post('/product', validateRequest(addProductValidate, 'body'), addProduct);
router.patch('/product', modifyProduct);
router.post('/addProductImage', upload.single('file'), addProductImage);
router.patch('/changeProductIsActive', validateRequest(changeProductIsActiveValidate, 'body'), changeProductIsActive);
router.get('/dateItem', validateRequest(getDateItemValidate, 'query'), getDateItem);
router.post('/sumData', validateRequest(getSumDataValidate, 'body'), getSumData);
router.get('/sellCount', getSellCount);
router.get('/sellOrders', getSellOrders);
router.patch('/deliver', validateRequest(sellDeliverValidate, 'body'), sellDeliver);
router.get('/orderDetail', validateRequest(getSellOrderDetailValidate, 'query'), getSellOrderDetail);
router.post('/cancelOrder', validateRequest(cancelOrderValidate, 'body'), cancelOrder);
export default router;
