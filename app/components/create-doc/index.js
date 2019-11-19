import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import userContext from '@context/user/userContext';
import Modal from '@common/modal';
import axiosInstance from '@util/axiosInstance';
import { SPACE_TYPE_ICON } from '@config/index';
import './index.css';

export default function CreateDoc({
  onModalChange = () => {}
}) {
  const [visible, setVisible] = useState(true);
  const [spaces, setSpaces] = useState([]);
  const history = useHistory();
  const { userInfo: { account } } = useContext(userContext);
  const onCancelModal = () => {
    setVisible(false);
    onModalChange(false);
  };
  const onConfirmModal = () => {
    setVisible(false);
    onModalChange(false);
  };
  // 获取空间列表
  const fetchSpaces = async () => {
    const [error, data] = await axiosInstance.get('spaces', {});
    if (!error && data && data.spaces.length > 0) {
      setSpaces(data.spaces);
    } else {
      // TODO 失败提示
      console.log('[获取空间列表失败] ', error);
    }
  };
  // 点击创建文档
  const onChooseSpace = async (info) => {
    const { scene, space_id } = info;
    const [error, data] = await axiosInstance.post('create/doc', {
      scene,
      space_id,
      title: '无标题'
    });
    if (!error && data && data.docId) {
      history.push(`/editor/${data.docId}?spaceId=${space_id}`);
    } else {
      // TODO 错误处理
      console.log('[创建文档出错] ', error);
    }
  };
  useEffect(() => {
    fetchSpaces();
  }, []);
  const spacesList = spaces.map(n => {
    return (
      <div
        onClick={() => { onChooseSpace(n); }}
        key={n.id}
        className="Header_Spaces_List flex">
        <img src={SPACE_TYPE_ICON[n.scene]} />
        <span>{account}</span>
        <span>/</span>
        <span>{n.name}</span>
        <img src={`/images/${n.public === 'SELF' ? 'lock' : 'global'}.png`} />
      </div>
    );
  });
  return (
    <Modal
      subTitle="点击选择一个知识库"
      title="新建文档"
      footer={'none'}
      onCancel={onCancelModal}
      onConfirm={onConfirmModal}
      visible={visible} >
      {spacesList}
    </Modal>
  );
};