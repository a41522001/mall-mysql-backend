import Joi from 'joi';
const cartItem = Joi.object({
  price: Joi.number().positive().required().messages({
    'number.base': '價錢錯誤',
    'number.positive': '價錢不得低於0元',
    'any.required': '價錢為必填欄位'
  }),
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
})
// 取得所有訂單資訊
export const getAllOrderValidate = Joi.object({
  userId: Joi.string().length(36).required().messages({
    'string.base': 'UserID錯誤',
    'string.empty': 'UserID不能為空',
    'string.length': 'UserID必須為{#limit}個字元',
    'any.required': 'UserID為必填欄位'
  })
})
// 取得單筆訂單資訊
export const getSingleOrderValidate = Joi.object({
  userId: Joi.string().length(36).required().messages({
    'string.base': 'UserID錯誤',
    'string.empty': 'UserID不能為空',
    'string.length': 'UserID必須為{#limit}個字元',
    'any.required': 'UserID為必填欄位'
  }), 
  orderId: Joi.string().length(11).required().messages({
    'string.base': 'OrderID錯誤',
    'string.empty': 'OrderID不能為空',
    'string.length': 'OrderID必須為{#limit}個字元',
    'any.required': 'OrderID為必填欄位'
  }),
})
// 新增訂單
export const addOrderValidate = Joi.object({
  userId: Joi.string().length(36).required().messages({
    'string.base': 'UserID錯誤',
    'string.empty': 'UserID不能為空',
    'string.length': 'UserID必須為{#limit}個字元',
    'any.required': 'UserID為必填欄位'
  }), 
  total: Joi.number().positive().required().messages({
    'number.base': '價錢錯誤',
    'number.positive': '價錢不得低於0元',
    'any.required': '價錢為必填欄位'
  }),
  cartList: Joi.array().items(cartItem).min(1).required().messages({
    'array.base': '產品列表錯誤',
    'array.min': '最少需要{#limit}件商品',
    'any.required': '產品列表為必填'
  })
})
// 取消訂單
export const cancelOrderValidate = Joi.object({
  orderId: Joi.string().length(11).required().messages({
    'string.base': 'OrderID錯誤',
    'string.empty': 'OrderID不能為空',
    'string.length': 'OrderID必須為{#limit}個字元',
    'any.required': 'OrderID為必填欄位'
  }),
})

