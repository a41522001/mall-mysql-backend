import { query } from '../db.ts';
import ApiError from '../models/errorModel.ts';
import { Products } from '../models/productModel.ts';
import { findAll } from '../services/sequelize.ts';
import { handleUploadFile } from '../utils/uploadFile.ts';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../config/sequelize.ts';
class ProductService {
  // 取得商品列表
  async getProductList() {
    const result = await findAll(Products, { isActive: 1 });
    return result;
  }
  // 取得賣家商品列表
  async getSellProductList(userId: string) {
    try {
      const result = await sequelize.query('CALL SP_GetSellProduct(:SellerId)', {
        replacements: {
          SellerId: userId
        }
      })
      return result;
    } catch (error) {
      throw new ApiError('發生未知錯誤', 500);
    }
  }
  // 新增商品
  async addProduct(seller: string, name: string, price: number, quantity: number, url: string) {
    try {
      await Products.create({
        id: uuidv4(),
        name: name,
        price: price,
        quantity: quantity,
        image: url,
        sellUserId: seller,
        isActive: 0
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
  // 更改商品上架/下架狀態
  async changeProductIsActive(productId: string, isActive: 0 | 1) {
    try {
      await Products.update(
        { isActive: isActive },
        {
          where: {
            id: productId
          }
        }
      )
    } catch (error) {
      new ApiError('更改狀態失敗請稍後再試', 500);
    }
  }
}
export default new ProductService();