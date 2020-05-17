import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@common/modal';
import Button from '@common/button';
import Icon from '@common/icon';
import axiosInstance from '@util/axiosInstance';
import useMessage from '@hooks/use-message';
import { getIn, delay } from '@util/util';
import { createNewDoc } from '@util/commonFun';
import './index.css';

const message = useMessage();

// 预览模版，跳转对应文档阅读页
const previewTemplate = (templateInfo) => {
  window.open(templateInfo.url, '_blank');
};

// 调用create/template接口，从模版创建新文档
const createDocByTemplateAction = async (templateInfo, spaceId, catalogInfo) => {
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
};

// 调用`delete/template`接口删除模版
const deleteTemplate = async function (info = {}) {
  const templateId = getIn(info, ['template_id']);
  const [error, data] = await axiosInstance.post('delete/template', {
    templateId
  });
  console.log(info);
  const isDeleteSuccess = getIn(data, ['STATUS']) === 'OK';
  if (isDeleteSuccess) {
    message.success({ content: `成功删除模版：${info.title}` });
  } else {
    message.error({ content: getIn(error, ['message'], '系统繁忙') });
  }
  return isDeleteSuccess ? templateId : '';
};

/**
  * 模版列表
  * @param {Array} templates - 模版列表数据
  * @param {string} spaceId - 空间Id
  * @param {object} catalogInfo - 目录信息
  * @param {Function} onChange(type, info) - 删除成功，触发的回调
*/
function TemplateList({
  templates,
  spaceId,
  catalogInfo,
  onChange
}) {
  const [isLoading, setLoading] = useState(false);
  if (!Array.isArray(templates)) {
    return null;
  }
  const onDelete = useCallback(async (item) => {
    if (isLoading) {
      return;
    }
    message.loading({ content: '正在删除...' });
    setLoading(true);
    const templateId = await deleteTemplate(item);
    setLoading(false);
    if (templateId) {
      onChange('DELETE', templateId);
    }
  }, [isLoading, templates]);
  return templates.map(item => {
    return (
      <div key={item.id}
        className="template">
        <img src={item.cover} />
        <p>{item.title}</p>
        <div className="template-button">
          <Button onClick={() => { previewTemplate(item); }}>预览</Button>
          <Button type="primary"
            onClick={() => { createDocByTemplateAction(item, spaceId, catalogInfo); }}>创建</Button>
          <Icon type="close"
            onClick={() => { onDelete(item); }} />
        </div>
      </div>
    );
  });
}

/**
  * 展示模版列表Modal
  * @param {string} className - Modal className
  * @param {boolean} show - 是否展示该组件
  * @param {string} spaceId - 空间Id
  * @param {object} catalogInfo - 目录信息
  * @param {Function} onConfirm - 点击确定回调
  * @param {Function} onHide - 隐藏Modal
*/
export default function CreateDocFromTemplateModal({
  className = '',
  spaceId,
  show,
  catalogInfo,
  onHide = () => { }
}) {
  if (!show) {
    return null;
  };
  const prefixClass = `${className}`;
  const [laoding, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [visible, setVisible] = useState(show);

  // 获取模版列表
  const fetchTemplates = useCallback(async () => {
    if (laoding) {
      return;
    }
    setLoading(true);
    message.loading({ content: '正在获取模版列表' });
    const [error, data] = await axiosInstance.post('templates');
    setLoading(false);
    message.hide();
    if (!Array.isArray(data) || data.length === 0) {
      message.error({ content: getIn(error, ['message'], '您还未创建模版') });
      return;
    }
    setTemplates(data.filter(n => n.url || n.cover));
  }, [laoding]);

  // templates改变
  const onTemplatesChange = useCallback((type, templateId) => {
    if (type === 'DELETE') {
      setTemplates(templates.filter(n => n.template_id !== templateId));
    }
  }, [templates]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  if (!Array.isArray(templates) || !templates.length) {
    return null;
  }
  return (
    <Modal
      className={prefixClass}
      visible={visible}
      width="auto"
      title="所有模版"
      subTitle=""
      footer="none"
      onCancel={onHide}
    >
      <div className="template-wrapper">
        <TemplateList
          templates={templates}
          spaceId={spaceId}
          catalogInfo={catalogInfo}
          onChange={onTemplatesChange}
        />
      </div>
    </Modal>
  );
};