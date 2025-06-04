import { Router } from "express";
import { getSystem } from "../controllers/systemController.js";
const router = Router();
router.get('/getSystem', getSystem);

export default router;