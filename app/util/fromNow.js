const MIN = 1000 * 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const YEAR = DAY * 365;
const MONTH = DAY * 30;

const zhCh = {
  1: '一',
  2: '两',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九'
};

export function fromNow(date) {
  const now = Date.now();
  if (isNaN(+date) && date) {
    date = new Date(date.replace(/-/g, '/')).getTime();
  }
  const dateTime = new Date(parseInt(date) || now).getTime();
  const del = now - dateTime;
  const abs = Math.abs(del);
  if (abs < MIN) {
    return '刚刚';
  }
  const year = Math.floor(abs / YEAR);
  const month = Math.floor((abs % YEAR) / MONTH);
  const day = Math.floor((abs % MONTH) / DAY);
  const hour = Math.floor((abs % DAY) / HOUR);
  const minute = Math.floor((abs % HOUR) / MIN);
  if (year >= 1) {
    if (month >= 5) {
      return `${zhCh[year]}年半前`;
    }
    return `${zhCh[year]}年前`;
  }
  if (month >= 1) {
    return `${month}个月前`;
  }
  if (day > 0) {
    return `${day}天前`;
  }
  if (hour > 0) {
    return `${hour}个小时前`;
  }
  return `${minute}分钟前`;
}