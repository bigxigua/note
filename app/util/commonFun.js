// ---------这里是一些业务相关的常用方法的合集------------ //

import axiosInstance from '@util/axiosInstance';

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