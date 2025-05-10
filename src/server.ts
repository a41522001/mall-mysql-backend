import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { verifyToken } from './middleware/verifyToken.ts';
import ping from './routes/pingRoute.ts';
import auth from './routes/authRoute.ts';
import product from './routes/productRoute.ts';
import cart from './routes/cartRoute.ts';
import order from './routes/orderRoute.ts';
import checkout from './routes/checkoutRoute.ts';
import { handleError } from './middleware/handleError.ts';
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(cors({
  // origin: ["http://localhost:3000", process.env.FRONT_END_URL!],
  origin: '*',
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/ping", ping);
app.use("/auth", auth);
app.use("/product", verifyToken, product);
app.use("/cart", verifyToken, cart);
app.use("/order", verifyToken, order);
app.use("/checkout", verifyToken, checkout);
app.use(handleError);

app.listen(port, () => {
  console.log('on server');
})