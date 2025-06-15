import ApiError from '../models/errorModel.js';
import { Products, Carts } from '../models/sequelizeModel.js';
import type { CartProductType } from '../types/cart.js';
class CartModel {
  // 新增購物車
  async addCart(productId: string, userID: string, quantity: number) {
    try {
      const [createdItem, created] = await Carts.findOrCreate({
        where: {
          productId,
          userId: userID
        },
        defaults: {
          quantity: quantity,
          productId,
          userId: userID
        }
      })

      if(!created) {
        await Carts.increment({ 
          quantity: quantity 
        }, 
        {
          where: {
            productId,
            userId: userID
          }
        })
      }
    } catch (error) {
      throw new ApiError('伺服器發生錯誤，請重新再試', 500);
    }
  }
  // 取得購物車
  async getCart(userID: string) {
    try {
      const result = await Carts.findAll({
        where: {
          userId: userID
        },
        attributes: ['quantity'],
        include: {
          model: Products,
          as: 'cartProduct',
          attributes: ['id', 'name', 'price', 'image']
        }
      })
      const finallyData = result.map((item) => {
        const plainItem = item.get({ plain: true }) as unknown as CartProductType & { quantity: number };
        const { quantity, cartProduct } = plainItem
        const { id, name, price, image } = cartProduct;
        return {
          productId: id,
          quantity,
          name,
          price,
          image
        }
      });
      return finallyData;
    } catch (error) {
      throw new ApiError('伺服器發生錯誤，請重新再試', 500);
    }
  }
  // 變更購物車數量
  private async changeCartQuantity(productId: string, stock: number, userID: string) {
    try {
      await Carts.update(
        { quantity: stock },
        {
          where: {
            productId: productId,
            userId: userID
          },
        },
      );
    } catch (error) {
      throw new ApiError('伺服器發生錯誤', 500);
    }
  }
  // 確認庫存
  async checkStock(productId: string, stock: number, userID: string): Promise<number | void> {
    try {
      const res = await Products.findByPk(productId, {
        attributes: ['quantity'],
        raw: true,
      })
      let quantity: number;
      if(res?.quantity) {
        quantity = res.quantity;
      }else {
        throw new ApiError('找不到此商品', 404);
      }
      if(quantity >= stock) {
        this.changeCartQuantity(productId, stock, userID);
      }else {
        throw new ApiError(`庫存不足，最多可加入 ${quantity} 件商品`, 400);
      }
    } catch (error: any) {
      if(error instanceof ApiError) {
        throw error
      }else {
        throw new ApiError('伺服器發生錯誤', 500);
      }
    }
  }
  // 刪除購物車
  async deleteCart(productId: string, userID: string) {
    try {
      await Carts.destroy({
        where: {
          productId: productId,
          userId: userID
        },
      });
    } catch (error) {
      throw new ApiError('伺服器發生錯誤', 500);
    }
  }
}
export default new CartModel();