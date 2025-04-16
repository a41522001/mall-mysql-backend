import { query } from '../db.ts';
import { Products } from '../models/productModel.ts';
import { findAll } from '../services/sequelize.ts';
import { handleUploadFile } from '../utils/uploadFile.ts';
class ProductService {
  // 取得商品列表
  async getProductList() {
    const result = await findAll(Products);
    return result;
  }
  // 新增商品
  async addProduct(name: string, price: number, quantity: number) {
    const queryString = `INSERT INTO Products(name, price, quantity)
      VALUES(?, ?, ?)`
    return await query(queryString, [name, price, quantity]);
  }
  // 新增商品圖片
  async addProductImage(file: any) {
    try {
      return await handleUploadFile(file);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
export default new ProductService();