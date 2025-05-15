import { Router } from "express";
import { getSystem } from "../controllers/systemController.ts";
const router = Router();
router.get('/getSystem', getSystem);

export default router;