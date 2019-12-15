// ---------这里是一些业务相关的常用方法的合集------------ //

import axiosInstance from '@util/axiosInstance';
import { getIn } from '@util/util';

// 调用添加最近使用记录接口调用
export async function addRecent({
  spaceId = '',
  type = '',
  docId = ''
}) {
  return axiosInstance.post('add/recent', {
    space_id: spaceId,
    type,
    doc_id: docId
  });
}

// 逻辑删除文档接口调用
export async function logicalDeletion({ docId, spaceId }) {
  const [error, data] = await axiosInstance.post('doc/update', {
    status: '0',
    doc_id: docId,
    space_id: spaceId
  });
  return !error && data && data.STATUS === 'OK';
}
// 物理删除文档接口调用
export async function physicalDeletion({ docId, spaceId }) {
  const [error, data] = await axiosInstance.post('doc/delete', {
    doc_id: docId,
    space_id: spaceId
  });
  return !error && data && data.STATUS === 'OK';
}
// 找到相同level的项
export function getEqualLevel(list, index, level) {
  const result = [];
  for (let i = index; i < list.length; i++) {
    if (list[i].level - level === 0) {
      result.push(list[i]);
    } else {
      break;
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
// 收起或展开目录
export function toggleExpandCatalog({
  trees, item, index
}, callback) {
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
}
// 创建文档
export async function createNewDoc(info, callback) {
  const { space_id: spaceId } = info;
  const [error, data] = await axiosInstance.post('create/doc', {
    scene: 'doc',
    space_id: spaceId,
    title: '无标题'
  });
  const docId = getIn(data, ['docId'], '');
  if (docId) {
    await addRecent({ spaceId, type: 'CreateEdit', docId });
    // eslint-disable-next-line standard/no-callback-literal
    callback({ docId, spaceId });
  } else {
    // eslint-disable-next-line standard/no-callback-literal
    callback(error);
  }
}