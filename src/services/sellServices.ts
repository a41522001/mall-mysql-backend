import ApiError from '../models/errorModel.js';
import { formatDateToYYYYMMDD, formatYYYYMMDDToSlash } from '../utils/index.js';
import { Period, SellSumData } from '../types/interface.js';
import { UserInfo, Products, sequelize, Orders, OrderItems } from '../models/sequelizeModel.js';
import { Op } from 'sequelize';
import { viewSellOrderDetail } from '../models/viewModel.js';

class SellService {
  // 取得chartItem
  getDateItem(period: Period) {
    switch (period) {
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
  // 取得chartData
  async getSumData(userId: string, period: Period): Promise<number[]> {
    try {
      // step1: 先抓取 startDate & endDate 帶入預存拿出{ created: '20250527', sum: 555 } 格式陣列
      const { start, end } = this.getStartAndEndDate(period);

      const result = await sequelize.query('CALL SP_GetSumData(:userId, :startDate, :endDate)', {
        replacements: {
          userId: userId,
          startDate: start,
          endDate: end,
        },
      });
      const periodMapping = {
        month: 30,
        season: 13 * 7,
        halfYear: 13 * 14,
        year: 12 * 30,
      };
      // step2: 生成時間範圍內的 { created: '20250527', sum: 0 } 格式陣列
      const dateArr = this.setDateSumArray(periodMapping[period]);
      // step3: 把預存拿回來的資料取代 dateArr
      const filterDateArr = this.setDateMap(result as SellSumData[], dateArr);
      const periodPerMapping = {
        month: 2,
        season: 7,
        halfYear: 14,
        year: 30,
      };
      // step4: 切割&聚合 根據periodPerMapping[period]的值 加總此週期範圍內的sum
      return this.setDateAndSum(periodPerMapping[period], filterDateArr);
    } catch (error) {
      throw new ApiError('發生未知錯誤', 500);
    }
  }
  // 取得銷售數量 (本月前五名)
  async getSellCount(userId: string) {
    try {
      const result = await sequelize.query('CALL SP_GetSellCount(:userId)', {
        replacements: {
          userId: userId,
        },
      });
      return result;
    } catch (error) {
      throw new ApiError('發生未知錯誤', 500);
    }
  }
  // 取得賣家所有訂單
  async getSellOrders(userId: string) {
    try {
      const result = await Orders.findAll({
        attributes: [['id', 'orderNo'], ['createdDate', 'date'], ['totalPrice', 'total'], 'status'],
        where: {
          status: {
            [Op.in]: ['paid', 'paying', 'deliver', 'delivered', 'cancel', 'finish'],
          },
        },
        include: [
          {
            model: UserInfo,
            as: 'userOrder',
            attributes: [['name', 'custom']],
            required: true,
          },
          {
            attributes: [],
            model: OrderItems,
            as: 'orderItemOrder',
            include: [
              {
                attributes: [],
                model: Products,
                as: 'productOrderItem',
                required: true,
                where: {
                  sellUserId: userId,
                },
              },
            ],
            required: true,
          },
        ],
        group: ['Orders.id', 'userOrder.id', 'userOrder.name'],
        order: [['createdDate', 'desc']],
        raw: true,
      });
      const res = result.map((item) => {
        const { ['userOrder.custom']: customValue, ...restOfItem } = item as any;
        return {
          ...restOfItem,
          custom: customValue,
        };
      });
      return res;
    } catch (error) {
      console.error(error);
    }
  }
  // 寄送商品
  async handleSellDeliver(orderId: string) {
    try {
      const result = await Orders.update(
        { status: 'deliver' },
        {
          where: {
            id: orderId,
          },
        }
      );
    } catch (error) {}
  }
  // 取得訂單詳情
  async getSellOrderDetail(orderId: string) {
    try {
      const result: any = await viewSellOrderDetail.findAll({
        attributes: [
          'image',
          'productName',
          'price',
          'quantity',
          'total',
          'userName',
          'email',
          'receiverName',
          'address',
          'phone',
          'status',
          'orderId',
          'createdDate',
          'createdTime',
        ],
        where: {
          orderId: orderId,
        },
        raw: true,
      });
      const createdTime = result[0].createdTime;
      const hour = createdTime.slice(0, 2);
      const minute = createdTime.slice(2, 4);
      const orderInfo = {
        total: result[0].total,
        receiverName: result[0].receiverName,
        email: result[0].email,
        address: result[0].address,
        phone: result[0].phone,
        status: result[0].status,
        orderId: result[0].orderId,
        userName: result[0].userName,
        createdDate: formatYYYYMMDDToSlash(result[0].createdDate),
        createdTime: `${hour}:${minute}`,
        products: [],
      };
      orderInfo.products = result.map((item: any) => {
        return {
          image: item.image,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
        };
      });
      return orderInfo;
    } catch (error) {
      console.error(error);
      throw new ApiError('發生未知錯誤', 500);
    }
  }
  // 取消訂單
  async cancelOrder(orderId: string) {
    try {
      const result = await Orders.update(
        { status: 'cancel' },
        {
          where: {
            id: orderId,
          },
        }
      );
    } catch (error) {
      throw new ApiError('發生未知錯誤', 500);
    }
  }
  // 把資料庫內的{ created: '20250527', sum: 555 } 放進以渲染好的date array temp裡
  private setDateMap(DBData: SellSumData[], dateData: SellSumData[]) {
    const dateMap = new Map();
    for (const item of DBData) {
      dateMap.set(item.createdDate, item.sum);
    }
    const result = dateData.map((item) => {
      if (dateMap.has(item.createdDate)) {
        return { ...item, sum: +dateMap.get(item.createdDate) };
      } else {
        return item;
      }
    });
    return result;
  }
  // 產生date和sum的陣列
  private setDateSumArray(period: number) {
    const arr = [];
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - period + 1);
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);
    while (startDate <= endDate) {
      arr.push({
        createdDate: formatDateToYYYYMMDD(startDate),
        sum: 0,
      });
      startDate.setDate(startDate.getDate() + 1);
    }
    return arr;
  }
  // 切割&聚合時間陣列[{createdData: YYYYMMDD, sum: 200}] (格式)
  private setDateAndSum(per: number, data: any[]): number[] {
    const result = [];
    for (let i = 0; i < data.length; i += per) {
      const sliceData = data.slice(i, i + per);
      const sum = sliceData.reduce((acc, item) => {
        return acc + Number(item.sum);
      }, 0);
      result.push(sum);
    }
    return result;
  }
  // 取得開始和結束日期
  private getStartAndEndDate(period: Period): { start: string; end: string } {
    const today = new Date();
    const periodMapping = {
      month: 30,
      season: 13 * 7,
      halfYear: 13 * 14,
      year: 12 * 30,
    };
    const end = formatDateToYYYYMMDD(today);
    const startDateObject = new Date(today);
    startDateObject.setDate(startDateObject.getDate() - periodMapping[period] + 1);
    const start = formatDateToYYYYMMDD(startDateObject);
    return {
      start,
      end,
    };
  }
  //-----------------取得日期列表-------------------------
  // 前1個月 總數15個
  private getMonthItem() {
    const dates = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 28);

    for (let i = 0; i < 30; i += 2) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const formattedDate = `${month.toString().padStart(2, '0')}/${day
        .toString()
        .padStart(2, '0')}`;
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
      const formattedDate = `${month.toString().padStart(2, '0')}/${day
        .toString()
        .padStart(2, '0')}`;

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
      const formattedDate = `${month.toString().padStart(2, '0')}/${day
        .toString()
        .padStart(2, '0')}`;

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
