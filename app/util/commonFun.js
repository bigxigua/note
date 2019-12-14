// ---------这里是一些业务相关的常用方法的合集------------ //

import axiosInstance from '@util/axiosInstance';

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