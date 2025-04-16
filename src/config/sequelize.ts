import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();
export const sequelize = new Sequelize(
  process.env.DB_DATABASE!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
  }
);
// 測試連線
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('成功連線到 MySQL 資料庫');
  } catch (err) {
    console.error('連線失敗:', err);
  }
}