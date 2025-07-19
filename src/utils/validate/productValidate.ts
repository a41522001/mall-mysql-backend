import Joi from 'joi';

// 新增商品
export const addProductValidate = Joi.object({
  productName: Joi.string().max(40).required().messages({
    'string.base': 'ProductName錯誤',
    'string.empty': 'ProductName不能為空',
    'string.length': 'ProductName長度不能超過{#limit}個字元',
    'any.required': 'ProductName為必填欄位',
  }),
  price: Joi.number().integer().required().messages({
    'number.base': 'Price必須為數字',
    'number.integer': 'Price必須為整數',
    'any.required': '必須帶入Price',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': '商品數量輸入錯誤',
    'number.integer': '商品數量必須為整數',
    'number.min': '商品數量不能低於{#limit}件',
    'any.required': '必須帶入商品數量',
  }),
  url: Joi.string().required().messages({
    'string.base': 'URL錯誤',
    'string.empty': 'URL不能為空',
    'any.required': 'URL為必填欄位',
  }),
});
// 更改商品上下架狀態
export const changeProductIsActiveValidate = Joi.object({
  productId: Joi.string().length(36).required().messages({
    'string.base': 'ProductID錯誤',
    'string.empty': 'ProductID不能為空',
    'string.length': 'ProductID長度必須是{#limit}個字元',
    'any.required': 'ProductID為必填欄位',
  }),
  isActive: Joi.number().integer().valid(0, 1).required().messages({
    'number.base': 'IsActive 必須為數字',
    'number.integer': 'IsActive 必須是整數',
    'any.only': 'IsActive 只能是 0 或 1',
    'any.required': 'IsActive 為必填欄位',
  }),
});
