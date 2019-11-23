
export function throttle(fn, wait = 2000, immediately = false) {
  let latestTime = Date.now();
  let _immediately_ = immediately;
  return function () {
    if (!_immediately_) {
      fn.apply(this, arguments);
      _immediately_ = true;
    } else {
      const curTime = Date.now();
      if (curTime >= latestTime + wait) {
        fn.apply(this, arguments);
        latestTime = curTime;
      }
    }
  };
};
export function debunce(fn, wait = 2000, immediately = false) {
  let timer = null;
  let _immediately_ = immediately;
  return function () {
    if (_immediately_) {
      fn.apply(this, arguments);
      _immediately_ = false;
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, wait);
    }
  };
}
export function isEmptyObject(param) {
  if (!param || typeof param !== 'object') {
    return true;
  }
  return Object.keys(param).length === 0;
}
// 格式化时间为：
export function formatTimeStamp(timestamp) {
  if (isNaN(+parseInt)) {
    timestamp = new Date(timestamp).getTime();
  }
  if (!timestamp) {
    return '-';
  }
  const date = new Date(+timestamp);
  const completionZero = function (number) {
    return `${number >= 9 ? '' : '0'}${number}`;
  };
  return `${date.getFullYear()}-` +
    `${completionZero(date.getMonth() + 1)}-` +
    `${completionZero(date.getDate())}` +
    `  ${completionZero(date.getHours())}:` +
    `${completionZero(date.getMinutes())}:` +
    `${completionZero(date.getSeconds())}`;
}

// 防空取参
export function getIn(data, array, initial = null) {
  let obj = Object.assign({}, data);
  for (let i = 0; i < array.length; i++) {
    if (typeof obj !== 'object' || obj === null) {
      return initial;
    }
    const prop = array[i];
    obj = obj[prop];
  }
  if (obj === undefined || obj === null) {
    return initial;
  }
  return obj;
};

// 解析url
export function parseUrlQuery(url = window.location.href) {
  const search = url.substring(url.lastIndexOf('?') + 1);
  const reg = /([^?&=]+)=([^?=&]*)/g;
  const hash = {};
  search.replace(reg, (match, $1, $2) => {
    let value = decodeURI($2);
    if (value === 'undefined' || value === 'null') {
      value = '';
    }
    hash[$1] = value;
    return match;
  });
  return hash;
}

// 修改url search
export function coverReplaceUrlSearch({ url = window.location.href, k, v }) {
  const pathname = url.substring(0, url.lastIndexOf('?') + 1);
  const temp = {
    ...parseUrlQuery(url)
  };
  if (k) {
    temp[`${k}`] = v;
  }
  const search = Object.keys(temp).map(n => {
    return `${n}=${temp[n]}`;
  }).join('&');
  return `${pathname}${search}`;
}