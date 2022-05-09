export const now_yyyy_mm_dd = (currentDate = new Date()) => {
  let date = '';

  date += currentDate.getFullYear() + '-';

  if (currentDate.getMonth() <= 9) {
    date += '0';
  }
  date += currentDate.getMonth() + 1 + '-';

  if (currentDate.getDate() <= 9) {
    date += '0';
  }
  date += currentDate.getDate();

  return date;
};
