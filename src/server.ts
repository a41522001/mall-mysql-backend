import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { verifyToken } from './middleware/verifyToken.js';
import ping from './routes/pingRoute.js';
import auth from './routes/authRoute.js';
import product from './routes/productRoute.js';
import cart from './routes/cartRoute.js';
import order from './routes/orderRoute.js';
import checkout from './routes/checkoutRoute.js';
import sell from './routes/sell.js';
import system from './routes/system.js';
import { handleError } from './middleware/handleError.js';
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(cors({
  origin: ["http://localhost:3000", process.env.FRONT_END_URL!],
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/ping", ping);
app.use("/api/auth", auth);
app.use("/api/product", verifyToken, product);
app.use("/api/cart", verifyToken, cart);
app.use("/order", verifyToken, order);
app.use("/api/checkout", verifyToken, checkout);
app.use("/api/sell", verifyToken, sell);
app.use("/system", verifyToken, system);
app.use(handleError);

app.listen(port, () => {
  console.log('on server');
})