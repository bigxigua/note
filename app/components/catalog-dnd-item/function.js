import { getSubs } from '@util/commonFun';

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

export function exChange(catalogs, sourceItem, destinationItem) {
  const destinationLevel = destinationItem.level;
  const sourceIndex = catalogs.findIndex(n => n.docId === sourceItem.docId);
  const destinationIndex = catalogs.findIndex(n => n.docId === destinationItem.docId);
  const baseLevel = destinationLevel + 1 === sourceItem.level ? 0 : destinationLevel + 1;
  const sourceSubs = getSubs(catalogs, sourceIndex, sourceItem.level).map(n => {
    return { ...n, level: baseLevel + n.level };
  });
  sourceItem.level = destinationLevel + 1;
  const destinationSubs = getSubs(catalogs, destinationIndex, destinationItem.level);
  if (sourceIndex < destinationIndex /* 下移 */) {
    catalogs.splice(destinationIndex + destinationSubs.length + 1, 0, ...[sourceItem, ...sourceSubs]);
    catalogs.splice(sourceIndex, sourceSubs.length + 1);
  }
  if (sourceIndex > destinationIndex /* 上移 */) {
    catalogs.splice(sourceIndex, sourceSubs.length + 1);
    catalogs.splice(destinationIndex + 1, 0, ...[sourceItem, ...sourceSubs]);
  }
  return catalogs;
}

// 生成settingList，并判断是否需要禁用【将目标项添加到该目录下】功能
export function checkMoveDisabled(selectedInfo, curCatalogInfo, catalog) {
  if (Object.keys(selectedInfo).length) {
    const { docId } = curCatalogInfo;
    const targetIndex = catalog.findIndex(n => n.docId === docId);
    const subs = getSubs(catalog, targetIndex, curCatalogInfo.level);
    console.log('subs:', subs);
    // 判断当前curCatalogInfo是否是selectedCatalog的子元素
  }
  return false;
}