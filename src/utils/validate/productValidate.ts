import Joi from 'joi';
// 取得賣家商品資訊
export const getSellerProduct = Joi.object({
  userId: Joi.string().length(36).required().messages({
    'string.base': 'UserID錯誤',
    'string.empty': 'UserID不能為空',
    'string.length': 'UserID長度必須是{#limit}個字元',
    'any.required': 'UserID為必填欄位'
  }),
})