import { Router } from "express";
import { testNotify, testReturn } from '../controllers/testController.ts';
const router = Router();
router.post('/return', testReturn);
router.post('/notify', testNotify);
export default router;