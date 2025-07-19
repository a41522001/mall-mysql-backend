import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_DATABASE!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    port: +process.env.DB_PORT!,
    dialect: 'mysql',
    logging: false,
  }
);
// 測試連線
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('成功連線到 MySQL 資料庫');
  } catch (err) {
    console.error('連線失敗:', err);
  }
}