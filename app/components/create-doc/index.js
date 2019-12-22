import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import userContext from '@context/user/userContext';
import Modal from '@common/modal';
import Icon from '@common/icon';
import axiosInstance from '@util/axiosInstance';
import { SPACE_TYPE_ICON } from '@config/index';
import useMessage from '@hooks/use-message';
import { delay } from '@util/util';
import { createNewDoc } from '@util/commonFun';
import './index.css';

export default function CreateDoc({
  onModalChange = () => { }
}) {
  const message = useMessage();
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const history = useHistory();
  const { userInfo: { account } } = useContext(userContext);

  // 取消
  const onCancelModal = () => {
    setVisible(false);
    onModalChange(false);
  };

  // 确认创建文档
  const onConfirmModal = () => {
    setVisible(false);
    onModalChange(false);
    history.push('/new');
  };

  // 点击创建文档，显示modal
  const onChooseSpace = async (info) => {
    createNewDoc(info, async ({ docId, spaceId }) => {
      if (docId && spaceId) {
        await delay();
        history.push(`/edit/${docId}?spaceId=${spaceId}`);
      } else {
        console.log('[创建文档出错] ');
      }
    });
  };

  // 获取空间列表
  const fetchSpaces = async () => {
    setLoading(true);
    const [error, data] = await axiosInstance.get('spaces', {});
    setLoading(false);
    if (error || !data || !Array.isArray(data.spaces) || data.spaces.length === 0) {
      message.error({ content: '服务器开小差啦！请稍后再试试呀.嘻嘻' });
      return;
    }
    setSpaces(data.spaces);
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  function renderSpaceList() {
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
        <img src={`/images/${n.public === 'SELF' ? 'lock' : 'global'}.png`} />
      </div >
    );
  }
  return (
    <Modal
      subTitle="点击选择一个知识库"
      title="新建文档"
      footer={spaces.length > 0 ? 'none' : null}
      onCancel={onCancelModal}
      onConfirm={onConfirmModal}
      confirmText="创建知识库"
      visible={visible} >
      {renderSpaceList()}
    </Modal>
  );
};