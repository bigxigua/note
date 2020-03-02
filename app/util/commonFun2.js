// ---------这里是一些业务相关的常用方法的合集2------------ //

import React from 'react';
import axiosInstance from '@util/axiosInstance';
import useMessage from '@hooks/use-message';
import Modal from '@common/modal';
import Image from '@common/image';
import Button from '@common/button';
import { getIn, delay } from '@util/util';
import { createNewDoc } from '@util/commonFun';

const message = useMessage();
// 是否正在获取模版列表
let loading = false;

// 预览该模版
const previewTemplate = (templateInfo) => {
  window.open(templateInfo.url, '_blank');
};

// 根据模版创建
const createDoc = async (templateInfo, spaceId, catalogInfo) => {
  const { title, html } = templateInfo;
  const [error, data] = await createNewDoc({
    space_id: spaceId,
    catalogInfo,
    title,
    html
  });
  const docId = getIn(data, ['docId']);
  if (docId) {
    message.success({ content: '创建成功' });
    await delay();
    window.location.href = `/simditor/${docId}?spaceId=${spaceId}`;
  } else {
    message.error({ content: getIn(error, ['message'], '系统繁忙') });
  }
  console.log(error, data);
};

// 调用添加最近使用记录接口调用
export async function createDocByTemplate(spaceId, catalogInfo = {}) {
  if (loading) {
    return;
  }
  message.loading({ content: '正在获取模版列表' });
  loading = true;
  const [error, data] = await axiosInstance.post('templates');
  loading = false;
  message.hide();
  if (!Array.isArray(data) || data.length === 0) {
    message.error({ content: getIn(error, ['message'], '无模版') });
    return;
  }
  const templatesJsx = data
    .filter(n => n.url || n.cover)
    .map(item => {
      return (
        <div key={item.id}
          className="template">
          <Image src={item.cover} />
          <p>{item.title}</p>
          <div className="template-button">
            <Button onClick={() => { previewTemplate(item); }}>预览该模版</Button>
            <Button type="primary"
              onClick={() => { createDoc(item, spaceId, catalogInfo); }}>创建</Button>
          </div>
        </div>
      );
    });
  Modal.confirm({
    width: 'auto',
    title: '所有模版',
    subTitle: '',
    content: <div className="template-wrapper">{templatesJsx}</div>,
    onOk: async () => {
    }
  });
}