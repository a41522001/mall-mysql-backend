import { Router } from "express";
import { getSystem } from "../controllers/systemController.js";
import { getSystemValidate } from '../utils/validate/systemValidate.js';
import { validateRequest } from '../middleware/validateRequest.js';
const router = Router();
router.get('/', validateRequest(getSystemValidate, 'query'), getSystem);

export default router;