export interface spParam {
  name: string;
  type: any;
  value: any;
}
export interface decodedToken {
  _id: string;
  email: string;
  iat: number;
  exp: number;
}
export interface ComparePad {
  id: string;
  password: string;
}