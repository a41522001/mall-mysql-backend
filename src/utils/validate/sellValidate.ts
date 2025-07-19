import Joi from 'joi';
const periodOptions = ['month', 'season', 'halfYear', 'year'] as const;

// 取得chartItem
export const getDateItemValidate = Joi.object({
  period: Joi.string()
    .valid(...periodOptions)
    .required()
    .messages({
      'any.only': 'period 只能是 month/season/halfYear/year',
      'string.base': 'period 類型錯誤',
      'string.empty': 'period 不能為空',
      'any.required': 'period 為必填欄位',
    }),
});
// 取得chartData
export const getSumDataValidate = Joi.object({
  period: Joi.string()
    .valid(...periodOptions)
    .required()
    .messages({
      'any.only': 'period 只能是 month/season/halfYear/year',
      'string.base': 'period 類型錯誤',
      'string.empty': 'period 不能為空',
      'any.required': 'period 為必填欄位',
    }),
});
// 寄送商品
export const sellDeliverValidate = Joi.object({
  orderId: Joi.string().required().messages({
    'string.base': 'orderId 類型錯誤',
    'string.empty': 'orderId 不能為空',
    'any.required': 'orderId 為必填欄位',
  }),
});
// 取得訂單詳情
export const getSellOrderDetailValidate = Joi.object({
  orderId: Joi.string().required().messages({
    'string.base': 'orderId 類型錯誤',
    'string.empty': 'orderId 不能為空',
    'any.required': 'orderId 為必填欄位',
  }),
});
// 取消訂單
export const cancelOrderValidate = Joi.object({
  orderId: Joi.string().required().messages({
    'string.base': 'orderId 類型錯誤',
    'string.empty': 'orderId 不能為空',
    'any.required': 'orderId 為必填欄位',
  }),
});
