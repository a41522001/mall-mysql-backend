export interface ProductDetail {
  currentProductName: string;
  currentProductStock: number;
  currentProductPrice: number;
  currentProductId: string;
}
export interface CheckoutProduct {
  image: string | null;
  perPrice: number;
  quantity: number;
  productID: string;
  orderItemID: string;
  productName: string;
}