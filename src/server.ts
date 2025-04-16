import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { verifyToken } from './middleware/verifyToken.ts';
import auth from './routes/authRoute.ts';
import product from './routes/productRoute.ts';
import cart from './routes/cartRoute.ts';
import order from './routes/orderRoute.ts';
dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/auth", auth);
app.use("/product", verifyToken, product);
app.use("/cart", verifyToken, cart);
app.use("/order", verifyToken, order);

app.listen(port, () => {
  console.log('on server');
})