import Joi from 'joi';
// 取得購物車
export const getCartValidate = Joi.object({
  userID: Joi.string().length(36).required().messages({
    'string.base': 'UserID錯誤',
    'string.empty': 'UserID不能為空',
    'string.length': 'UserID必須為{#limit}個字元',
    'any.required': 'UserID為必填欄位'
  })
});
// 新增購物車
export const addCartValidate = Joi.object({
  productId: Joi.string().length(36).required().messages({
    'string.base': '商品ID錯誤',
    'string.empty': '商品ID不能為空',
    'string.length': '商品ID長度必須是{#limit}個字元',
    'any.required': '商品ID為必填欄位'
  }),
  userId: Joi.string().length(36).required().messages({
    'string.base': '使用者ID錯誤',
    'string.empty': '使用者ID不能為空',
    'string.length': '使用者ID長度必須是{#limit}個字元',
    'any.required': '使用者ID為必填欄位'
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': '商品數量輸入錯誤',
    'number.integer': '商品數量必須為整數',
    'number.min': '商品數量不能低於{#limit}件',
    'any.required': '必須帶入商品數量'
  })
})
// 更改購物車數量
export const changeCartQuantityValidate = Joi.object({
  productID: Joi.string().length(36).required().messages({
    'string.base': '商品ID錯誤',
    'string.empty': '商品ID不能為空',
    'string.length': '商品ID長度必須是{#limit}個字元',
    'any.required': '商品ID為必填欄位'
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': '商品數量輸入錯誤',
    'number.integer': '商品數量必須為整數',
    'number.min': '商品數量不能低於{#limit}件',
    'any.required': '必須帶入商品數量'
  }),
  userID: Joi.string().length(36).required().messages({
    'string.base': '使用者ID錯誤',
    'string.empty': '使用者ID不能為空',
    'string.length': '使用者ID長度必須是{#limit}個字元',
    'any.required': '使用者ID為必填欄位'
  }),
})
// 刪除購物車
export const deleteCartValidate = Joi.object({
  productID: Joi.string().length(36).required().messages({
    'string.base': '商品ID錯誤',
    'string.empty': '商品ID不能為空',
    'string.length': '商品ID長度必須是{#limit}個字元',
    'any.required': '商品ID為必填欄位'
  }),
  userID: Joi.string().length(36).required().messages({
    'string.base': '使用者ID錯誤',
    'string.empty': '使用者ID不能為空',
    'string.length': '使用者ID長度必須是{#limit}個字元',
    'any.required': '使用者ID為必填欄位'
  }),
})