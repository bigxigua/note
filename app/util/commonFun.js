/* eslint-disable standard/no-callback-literal */
// ---------这里是一些业务相关的常用方法的合集------------ //
import React from 'react';
import axiosInstance from '@util/axiosInstance';
import useMessage from '@hooks/use-message';
import { Modal } from 'xigua-components/dist/js';
import DeleteConfirm from '@components/delete-confirm';

import { getIn, delay } from '@util/util';

const message = useMessage();

// 调用添加最近使用记录接口调用
export async function addRecent({
  spaceId = '',
  spaceName = '',
  docId = '',
  docTitle = '',
  type = ''
}) {
  return axiosInstance.post('add/recent', {
    space_id: spaceId, // 空间id
    space_name: spaceName, // 空间名称
    doc_id: docId, // 文档id
    doc_title: docTitle, // 文档标题
    type // 类型
  });
}

// 逻辑删除文档接口调用
export async function logicalDeletion({ docId, spaceId } = {}) {
  const [error, data] = await axiosInstance.post('doc/update', {
    status: '0',
    doc_id: docId,
    space_id: spaceId
  });
  return !error && data && data.STATUS === 'OK';
}

// 物理删除文档接口调用
export async function physicalDeletion({ docId } = {}) {
  const [error, data] = await axiosInstance.post('doc/delete', {
    docId
  });
  return !error && data && data.STATUS === 'OK';
}

// 创建文档接口调用
// catalogInfo = {folderDocId, level}
// folderDocId为对应结构化catalog就是当前新增目录的上一个目录的docId
export async function createNewDoc(info, callback = () => { }) {
  const { space_id: spaceId, scene = 'doc', title = '无标题', html = '', catalogInfo = {} } = info;
  const [error, data] = await axiosInstance.post('create/doc', {
    html,
    title,
    scene,
    catalogInfo,
    space_id: spaceId
  });
  const docId = getIn(data, ['docId'], '');
  if (docId) {
    // eslint-disable-next-line standard/no-callback-literal
    callback({ docId, spaceId });
  } else {
    // eslint-disable-next-line standard/no-callback-literal
    message.error({ content: getIn(error, ['message'], '系统繁忙') });
    callback(error);
  }
  return [error, data];
}

// 创建文档接口二次封装，判断成功失败后的行为
export async function createNewDocAction(info = {}) {
  return createNewDoc(info, async ({ docId, spaceId }) => {
    if (docId && spaceId) {
      message.success({ content: '创建成功！' });
      await delay();
      window.location.href = `/simditor/${docId}?spaceId=${spaceId}`;
    }
  });
}

// 更新目录接口调用
export async function updateCatalogService({ spaceId, catalog }) {
  const [error, data] = await axiosInstance.post('spaces/update', {
    space_id: spaceId,
    catalog: JSON.stringify(catalog)
  });
  return [error, data];
}

// 找到相同level的项
export function getEqualLevel(list, index, level) {
  const result = [];
  for (let i = index; i < list.length; i++) {
    if (list[i].level < level) {
      break;
    }
    if (list[i].level === level) {
      result.push(list[i]);
    }
  }
  return result;
}

// 格式化目录结构
export function extractCatalog(source) {
  const sourceData = source.slice(0);
  const findIndexByDocId = (arr, docId) => {
    return arr.findIndex(n => n.docId === docId);
  };
  function recursion(data, minLevel) {
    const result = [];
    if (!data || data.length === 0 || !data[0]) {
      return [];
    }
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      if (item.level === minLevel && findIndexByDocId(sourceData, item.docId) !== -1) {
        const newItem = {
          ...item,
          children: []
        };
        const sourceIndex = source.findIndex(n => n.docId === item.docId);
        const subSource = getEqualLevel(source, sourceIndex + 1, item.level + 1);
        newItem.children.push(...recursion(subSource, item.level + 1));
        result.push(newItem);
        sourceData.splice(findIndexByDocId(sourceData, item.docId), 1);
      }
    };
    return result;
  }
  return recursion(source, 0);
};

// 通过docId找到目标目录项
export function findTargetCatalogPath(catalog, docId) {
  if (!docId || !Array.isArray(catalog) || !catalog.length) {
    return [];
  }
  let result = [];
  function recursion(data, init = []) {
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      const children = item.children || [];
      if (item.docId === docId) {
        result = [...init, i];
        break;
      } else if (children.length > 0) {
        recursion(children, [...init, i]);
      }
    }
    return result;
  }
  return recursion(catalog, []);
}

// 收起或展开目录
export function toggleExpandCatalog({
  trees, item, index
}, callback = () => { }) {
  const { open = false, children = [], docId } = item;
  const result = trees.slice(0);
  result[index].open = !open;
  if (!open) {
    const subs = children.map(n => {
      return {
        ...n,
        belong: docId
      };
    });
    result.splice(index + 1, 0, ...subs);
    callback(result);
  } else {
    callback(result.filter(n => n.belong !== docId));
  }
  return result;
}

// textarea 自适应高度
export function setTextAreaAutoHeight(element, extra = 0, maxHeight) {
  if (!element) {
    return;
  }
  const getStyle = name => {
    return window.getComputedStyle(element, null)[name];
  };
  const isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window;
  const isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera');
  const minHeight = parseFloat(getStyle('height'));
  const addEvent = document.addEventListener;

  element.style.resize = 'none';

  const change = () => {
    let scrollTop;
    let height;
    let padding = 0;
    const style = element.style;

    if (element._length === element.value.length) return;
    element._length = element.value.length;

    if (!isFirefox && !isOpera) {
      padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
    };
    scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

    element.style.height = minHeight + 'px';
    if (element.scrollHeight > minHeight) {
      if (maxHeight && element.scrollHeight > maxHeight) {
        height = maxHeight - padding;
        style.overflowY = 'auto';
      } else {
        height = element.scrollHeight - padding;
        style.overflowY = 'hidden';
      };
      style.height = height + extra + 'px';
      scrollTop += parseInt(style.height) - element.currHeight;
      document.body.scrollTop = scrollTop;
      document.documentElement.scrollTop = scrollTop;
      element.currHeight = parseInt(style.height);
    };
  };

  addEvent('propertychange', change);
  addEvent('input', change);
  addEvent('focus', change);
  change();
}

// 获取当前文档的子节点
// function getSub(catalog, start, level) {
//   const result = [];
//   for (let i = start; i < catalog.length; i++) {
//     if (catalog[i].level > level) {
//       result.push(catalog[i]);
//     } else {
//       break;
//     }
//   }
//   return result;
// }

// 删除文档节点
export function deleteDoc({ docId, docTitle }, callback) {
  const modal = Modal.confirm({
    title: '删除文档',
    content: <DeleteConfirm
      name={docTitle}
      docId={docId}
      description="如果该节点下有子节点，会被一并删除，请慎重。(若想恢复请联系站长)"
      onConfirmEnd={(status) => { callback(status); status && modal.destroy(); }} />,
    footer: 'none'
  });
}

/**
* 调用添加文档为模版接口，并做统一交互
* @param {objecr} info - 文档信息
* @param {string} type - 显示草稿还是正式内容
* @return {object} { title: 标题， content: 文档内容 }
*/
let isLoading = false;
export async function setDocToTemplate({ docId }) {
  if (isLoading) {
    return [];
  }
  isLoading = true;
  message.loading({ content: '正在设置,这可能会需要点时间...' });
  const [error, data] = await axiosInstance.post('create/template', { docId });
  isLoading = false;
  if (getIn(data, ['templateId'])) {
    message.success({ content: '模版设置成功' });
  } else {
    message.error({ content: getIn(error, ['message'], '系统繁忙') });
  }
  return [error, data];
}

// 获取序列化后目录中index项元素的所有子目录
export function getSubs(catalogs, index, level) {
  const subs = [];
  for (let i = index + 1; i < catalogs.length; i++) {
    const n = catalogs[i];
    if (n.level <= level) {
      break;
    }
    subs.push(n);
  };
  return subs;
};