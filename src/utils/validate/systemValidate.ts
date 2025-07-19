import Joi from 'joi';
export const getSystemValidate = Joi.object({
  sysNo: Joi.string().required().messages({
    'string.base': 'sysNo的類型應為字串',
    'string.empty': 'sysNo不能為空',
    'any.required': 'sysNo為必填欄位'   
  })
})