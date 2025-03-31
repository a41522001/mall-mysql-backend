import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { verifyToken } from './middleware/verifyToken';
import auth from './routes/authRoute';
import product from './routes/productRoute';
import cart from './routes/cartRoute';
import order from './routes/orderRoute';
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