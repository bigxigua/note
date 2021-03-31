export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
export function isEmptyObject(param) {
  if (!param || typeof param !== 'object') {
    return true;
  }
  return Object.keys(param).length === 0;
}
export function isPromise(fn) {
  return fn && typeof fn.then === 'function';
}
export function throttle(fn, wait = 2000, immediately = false) {
  let latestTime = Date.now();
  let _immediately_ = immediately;
  return function () {
    if (_immediately_) {
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

// 格式化时间
export function formatTimeStamp(timestamp, type = 'normal') {
  if (!timestamp) {
    return '-';
  }
  if (isNaN(+timestamp) && timestamp) {
    timestamp = new Date(timestamp.replace(/-/g, '/')).getTime();
  }
  const date = new Date(+timestamp);
  const completionZero = function (number) {
    return `${number > 9 ? '' : '0'}${number}`;
  };
  const base =
    `${completionZero(date.getMonth() + 1)}-` +
    `${completionZero(date.getDate())}` +
    `\xa0${completionZero(date.getHours())}:` +
    `${completionZero(date.getMinutes())}`;

  if (type === 'simple') {
    return base;
  }
  if (type === 'normal') {
    return `${date.getFullYear()}-${base}:${completionZero(date.getSeconds())}`;
  }
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

// 安全设置对象数据
export function setIn(data, array, value) {
  if (!array || array.length === 0) return data;
  const setRecursively = function (state, array, value, index) {
    let clone = {};
    let newState;
    const prop = array[index];
    if (array.length > index) {
      clone = Array.isArray(state) ? state.slice(0) : Object.assign({}, state);
      newState = ((isObject(state) || Array.isArray(state)) && state[prop] !== undefined) ? state[prop] : {};
      clone[prop] = setRecursively(newState, array, value, index + 1);
      return clone;
    }
    return value;
  };
  return setRecursively(data, array, value, 0);
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
    hash[$1] = value.split('#')[0];
    return match;
  });
  return hash;
}

// 拆分url字符串为location对象
export function stringTransformToUrlObject(str) {
  let url = {};
  try {
    url = new URL(str);
  } catch (error) {
  }
  const { pathname = '', search = '' } = url;
  return {
    url,
    pathname: pathname + search
  };
}

// 修改url search
export function coverReplaceUrlSearch({ url = window.location.href, k, v }) {
  const { pathname, origin } = new URL(url);
  const temp = {
    ...parseUrlQuery(url)
  };
  if (k) {
    temp[`${k}`] = v;
  }
  const search = Object.keys(temp).map(n => {
    return `${n}=${temp[n]}`;
  }).join('&');
  return `${origin}${pathname}?${search}`;
}

// 延迟
export async function delay(time = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

// 监听键盘按下事件
export function addKeydownListener({
  handle = () => { }
}) {
  const fn = (e) => {
    const keyCode = e.keyCode || e.which || e.charCode;
    const ctrlKey = e.ctrlKey || e.metaKey;
    handle({ keyCode, ctrlKey, e });
  };
  document.body.addEventListener('keydown', fn, false);
  return {
    remove: () => { document.body.removeEventListener('keydown', fn); }
  };
}

// dom 事件绑定
export function addEventListener(dom = document.body, eventName, handle, useCapture = false) {
  dom.addEventListener(eventName, handle, useCapture);
  return () => {
    dom.removeEventListener(eventName, handle);
  };
};

// 判断是否为移动端浏览器
export function checkBrowser() {
  const isIos = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent);
  const isMobile = isIos || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent);
  return {
    isIos,
    isMobile
  };
}

// getClass 少写三目运算符
export function getClass(condition, str1, str2 = '') {
  return condition ? str1 : str2;
}

// fix 以前文档存数据库时，用的是ip地址的问题
export function transformIpToDomain(url) {
  // http://139.196.84.53/article/q6zolawid9mg?spaceId=2fz1c9j94va6z
  // http://www.bigxigua.net/
  return url.replace(/139\.196\.84\.53/g, 'www.bigxigua.net');
}

// 提取editormd目录
export function getCatalogs(html) {
  const catalogs = [];
  try {
    Array.from($(html)).forEach((dom, index) => {
      const tagName = dom.tagName;
      if (['H1', 'H2', 'H3', 'H4', 'H5'].includes(tagName)) {
        catalogs.push({
          index,
          text: dom.innerText,
          id: $(dom).attr('id') || '',
          type: tagName.toLowerCase()
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
  return catalogs.filter(n => n.text.trim());
}