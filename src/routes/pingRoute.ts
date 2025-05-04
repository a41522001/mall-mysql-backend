import { Router } from "express";

const router = Router();
router.get('/', (req, res) => {
  res.send('pong from 3888');
});
export default router;
