import { ParsedQs } from 'qs';
import { query } from '../db.ts';
import ApiError from '../models/errorModel.ts';
import { Products } from '../models/productModel.ts';
import { findAll } from '../services/sequelize.ts';
import { handleUploadFile } from '../utils/uploadFile.ts';
import { v4 as uuidv4 } from 'uuid';
class ProductService {
  // 取得商品列表
  async getProductList() {
    const result = await findAll(Products);
    return result;
  }
  // 取得賣家商品列表
  async getSellProductList(userId: string) {
    try {
      const result = await Products.findAll({
        where: {
          sellUserId: userId
        },
        raw: true
      })
      return result;
    } catch (error) {
      throw new ApiError('發生未知錯誤', 500);
    }
  }
  // 新增商品
  async addProduct(seller: string, name: string, price: number, quantity: number, url: string) {
    console.log(seller);
    console.log(name);
    console.log(price);
    console.log(quantity);
    console.log(url);
    try {
      await Products.create({
        id: uuidv4(),
        name: name,
        price: price,
        quantity: quantity,
        image: url,
        sellUserId: seller
      })
    } catch (error) {
      throw new ApiError('新增商品發生錯誤請稍後再試', 500);
    }
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