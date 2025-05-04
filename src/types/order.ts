interface Product {
  image: string | null;
  perPrice: number;
  quantity: number;
  productID: string;
  orderItemID: string;
  productName: string;
}
export interface OrderDetail {
  userID: string;
  email: string;
  name: string;
  orderID: string;
  total: number;
  products: Product[];
}
