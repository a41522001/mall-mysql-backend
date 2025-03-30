import { query } from '../db';
import { testConnection, UserInfo, Products } from '../models/sequelizeModel';
import { findAll } from '../services/sequelize';
class ProductModel {
  // 取得商品列表
  async getProductList() {
    const result = findAll(Products);
    return result
    
  }
  async addProduct(name: string, price: number, quantity: number) {
    const queryString = `INSERT INTO Products(name, price, quantity)
      VALUES(?, ?, ?)`
    return await query(queryString, [name, price, quantity]);
  }
}
export default new ProductModel();