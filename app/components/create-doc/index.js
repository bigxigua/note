import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import userContext from '@context/user/userContext';
import Modal from '@common/modal';
import Icon from '@common/icon';
import axiosInstance from '@util/axiosInstance';
import { SPACE_TYPE_ICON } from '@config/index';
import useMessage from '@hooks/use-message';
import { delay, getIn } from '@util/util';
import { createNewDoc } from '@util/commonFun';
import { createDocByTemplate } from '@util/commonFun2';
import './index.css';

const message = useMessage();

/**
* 新建文档通用组件
* @param {string} mode - 创建方法，枚举值，common-普通新建 template-从模版创建
* @param {Function} onModalChange - modal关闭或展示时触发
*/
export default function CreateDoc({
  mode = 'common',
  onModalChange = () => { }
}) {
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const history = useHistory();
  const { userInfo: { account } } = useContext(userContext);

  // 取消
  const onCancelModal = useCallback(() => {
    setVisible(false);
    onModalChange(false);
  }, []);

  // 点击创建文档，显示modal
  const onChooseSpace = useCallback(async (info) => {
    if (mode === 'template') {
      createDocByTemplate(info.space_id);
      return;
    }
    createNewDoc(info, async ({ docId, spaceId }) => {
      if (docId && spaceId) {
        message.success({ content: '创建成功！' });
        await delay();
        history.push(`/simditor/${docId}?spaceId=${spaceId}`);
      } else {
        message.error({ content: '创建失败！' });
      }
    });
  }, [mode]);

  // 获取空间列表
  const fetchSpaces = useCallback(async () => {
    setLoading(true);
    const [error, data] = await axiosInstance.get('spaces', {});
    setLoading(false);
    if (error || !data || !Array.isArray(data.spaces) || data.spaces.length === 0) {
      message.error({ content: getIn(error, ['message'], '服务器开小差啦！请稍后再试试呀.嘻嘻') });
      return;
    }
    setSpaces(data.spaces);
  }, []);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const renderSpaceList = useCallback(() => {
    if (loading) {
      return <div className="create_loading">
        <Icon type="loading" />
        <span>正在加载...</span>
      </div>;
    }
    if (spaces.length === 0) {
      return <div className="create_modal_tips">您还未创建过知识库哟，文档存在知识库里。分好类，好查询</div>;
    }
    return spaces.map(n =>
      <div
        onClick={() => { onChooseSpace(n); }}
        key={n.id}
        className="Header_Spaces_List flex">
        <img src={SPACE_TYPE_ICON[n.scene]} />
        <span>{account}</span>
        <span>/</span>
        <span style={{ maxWidth: 'calc(100% - 100px)' }}
          className="ellipsis">{n.name}</span>
        {/* <img src={`/images/${n.public === 'SELF' ? 'lock' : 'global'}.png`} /> */}
      </div >
    );
  }, [loading, spaces]);

  return (
    <Modal
      subTitle="点击选择一个知识库"
      title="新建文档"
      footer={spaces.length > 0 ? 'none' : null}
      onCancel={onCancelModal}
      confirmText="创建知识库"
      visible={visible} >
      {renderSpaceList()}
    </Modal>
  );
};