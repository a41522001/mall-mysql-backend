export const getTodayDate = () => {
  const now = new Date();

  // 取得年月日並格式化成 20250325
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}