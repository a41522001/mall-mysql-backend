import Joi from 'joi';
// 註冊
export const signupValidate = Joi.object({
  name: Joi.string().required().messages({
    'string.base': '請提供姓名',
    'string.empty': '姓名不能為空',
    'any.required': '姓名為必填欄位'
  }),
  email: Joi.string().required().email().messages({
    'string.base': '請提供有效的電子郵件地址',
    'string.empty': '電子郵件不能為空',
    'string.email': '請提供有效的電子郵件地址',
    'any.required': '電子郵件為必填欄位'
  }), 
  password: Joi.string().required().min(6).messages({
    'string.base': '請提供有效的密碼',
    'string.empty': '密碼不能為空',
    'string.min': '密碼不可低於{#limit}個字元',
    'any.required': '請提供有效的密碼'
  })
})
// 登入
export const loginValidate = Joi.object({
  email: Joi.string().required().email().messages({
    'string.base': '請提供有效的電子郵件地址',
    'string.empty': '電子郵件不能為空',
    'string.email': '請提供有效的電子郵件地址',
    'any.required': '電子郵件為必填欄位'
  }), 
  password: Joi.string().required().messages({
    'string.base': '請提供有效的密碼',
    'string.empty': '密碼不能為空',
    'any.required': '請提供有效的密碼'
  })
})
