import { raw } from "mysql2";

export const findAll = async (table: any, condition?: any) => {
  try {
    const result = await table.findAll({
      where: condition,
      raw: true
    })
    return result
  } catch (error) {
    return 'error'
  }
}