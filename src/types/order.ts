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
export interface AllOrderDetail {
  orderId: string;
  totalPrice: number;
  status: Status;
  createdDate: string;
  product: { quantity: number; productName: string;}[];
}
export type Status = 'pending' | 'delete' | 'cancel' | 'paying' | 'paid';
