import { query } from '../db.ts';
import ApiError from '../models/errorModel.ts';
import { Products } from '../models/productModel.ts';
import { findAll } from '../services/sequelize.ts';
import { handleUploadFile } from '../utils/uploadFile.ts';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../config/sequelize.ts';
import { formatDateToYYYYMMDD } from '../utils/index.ts';
type Period = 'month' | 'season' | 'halfYear' | 'year';
class SellService {
  getDateItem(period: string) {
    switch(period) {
      case 'month':
        return this.getMonthItem();
      case 'season':
        return this.getSeasonItem();
      case 'halfYear':
        return this.getHalfYearItem();
      case 'year': 
        return this.getYearItem();
    }
  }
  async getSumData(userId: string, period: Period): Promise<number[]> {
    try {
      const { start, end } = this.getStartAndEndDate(period);
      const result = await sequelize.query('CALL SP_GetSumData(:userId, :startDate, :endDate)', {
        replacements: {
          userId: userId,
          startDate: start,
          endDate: end
        }
      })
      const periodMapping = {
        month: 2,
        season: 7,
        halfYear: 14,
        year: 30
      }
      return this.setDateAndSum(periodMapping[period], result);
    } catch (error) {
      throw new ApiError('發生未知錯誤', 500);
    }
  }
  // 切割&聚合從預存拿出來的[{createdData: YYYYMMDD, sum: 200}] (格式)
  private setDateAndSum(per: number, data: any[]): number[] {
    const result = [];
    for(let i = 0; i < data.length; i += per) {
      const sliceData = data.slice(i, i+per);
      const sum = sliceData.reduce((acc, item) => {
        return acc + Number(item.sum);
      }, 0)
      result.push(sum);
    }
    return result;
  }

  // 取得開始和結束日期
  private getStartAndEndDate(period: Period): { start: number; end: number } {
    const today = new Date();
    const periodMapping = {
      month: 30,
      season: 13 * 7,
      halfYear: 13 * 14,
      year: 12 * 30
    }
    const end = +formatDateToYYYYMMDD(today);
    const startDateObject = new Date(today);
    startDateObject.setDate(startDateObject.getDate() - periodMapping[period]);
    const start = +formatDateToYYYYMMDD(startDateObject);
    return {
      start,
      end
    }
  }
  //-----------------取得日期列表-------------------------
  // 前1個月 總數15個
  private getMonthItem() {
    const dates = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 29);

    for (let i = 0; i < 30; i+=2) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
      dates.push(formattedDate);
    }
    return dates;
  }
  // 前3個月 總數13個
  private getSeasonItem() {
    const labels = [];
    const numberOfWeeks = 13;
    const today = new Date();
    const firstWeekEndDate = new Date(today);
    firstWeekEndDate.setDate(today.getDate() - (numberOfWeeks - 1) * 7);

    // 從第一週的結束日開始，循環13次，每次增加7天
    for (let i = 0; i < numberOfWeeks; i++) {
      const currentWeekEndDate = new Date(firstWeekEndDate);
      currentWeekEndDate.setDate(firstWeekEndDate.getDate() + i * 7);

      const month = currentWeekEndDate.getMonth() + 1;
      const day = currentWeekEndDate.getDate();
      const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;

      labels.push(formattedDate);
    }
    return labels;
  }
  // 前6個月 總數13個
  private getHalfYearItem() {
    const labels = [];
    const numberOfWeeks = 13;
    const today = new Date();
    const firstWeekEndDate = new Date(today);
    firstWeekEndDate.setDate(today.getDate() - (numberOfWeeks - 1) * 14);

    // 從第一週的結束日開始，循環13次，每次增加14天
    for (let i = 0; i < numberOfWeeks; i++) {
      const currentWeekEndDate = new Date(firstWeekEndDate);
      currentWeekEndDate.setDate(firstWeekEndDate.getDate() + i * 14);

      const month = currentWeekEndDate.getMonth() + 1;
      const day = currentWeekEndDate.getDate();
      const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;

      labels.push(formattedDate);
    }
    return labels;
  }
  // 前12個月 總數12個
  private getYearItem() {
    const labels = [];
    const firstDayOfReferenceMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    for (let i = 0; i < 12; i++) {
      const targetMonthDate = new Date(firstDayOfReferenceMonth);
      // setMonth 會自動處理年份的進位或借位
      targetMonthDate.setMonth(firstDayOfReferenceMonth.getMonth() - i);

      const year = targetMonthDate.getFullYear();
      const month = targetMonthDate.getMonth() + 1; 
      labels.push(`${year}-${month.toString().padStart(2, '0')}`);
    }
    return labels.reverse();
  }
}

export default new SellService();