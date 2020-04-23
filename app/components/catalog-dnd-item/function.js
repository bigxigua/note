
// 获取当前目录的所有子元素的个数(包括子元素的子元素)
export function getChildLength(item) {
  let len = 0;
  function recursive(children) {
    if (!Array.isArray(children) || !children.length) {
      return 0;
    }
    len += children.length;
    children.forEach(n => { recursive(n.children); });
    return len;
  }
  return recursive(item.children);
}

export function getStyle(style, item) {
  const len = getChildLength(item);
  const { level } = item;
  return {
    ...style,
    height: len === 0 ? '36px' : `${(len + 1) * (36 + 8)}px`,
    marginLeft: level !== 0 ? '32px' : 0
  };
}

export function getOffsetImgClassName(curCatalogInfo, index, type) {
  const { level } = curCatalogInfo;
  const DISABLED_CLASS = 'chapter-item__move-disabled';
  if (type === 'left' /* 左移 */) {
    if (level === 0) {
      return DISABLED_CLASS;
    }
  } else {
    if (index === 0) {
      return DISABLED_CLASS;
    }
  }
  return '';
}

export function levelDiminishing(catalogInfo, baseLevel) {
  return {
    ...catalogInfo,
    level: baseLevel + 1
  };
}