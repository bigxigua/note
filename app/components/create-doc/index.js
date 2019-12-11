import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import userContext from '@context/user/userContext';
import Modal from '@common/modal';
import axiosInstance from '@util/axiosInstance';
import { SPACE_TYPE_ICON } from '@config/index';
import useMessage from '@hooks/use-message';
import { delay } from '@util/util';
import { addRecent } from '@util/commonFun';
import './index.css';

export default function CreateDoc({
  onModalChange = () => { }
}) {
  const message = useMessage();
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
    history.push('/new');
  };
  // 获取空间列表
  const fetchSpaces = async () => {
    const [error, data] = await axiosInstance.get('spaces', {});
    if (error || !data || !Array.isArray(data.spaces)) {
      message.error({ content: '服务器开小差啦！请稍后再试试呀.嘻嘻' });
      console.log('[获取空间列表失败] ', error);
      return;
    }
    if (data.spaces.length === 0) {
      // TODO 提示用户去创建空间
    }
    setSpaces(data.spaces);
  };
  // 点击创建文档
  const onChooseSpace = async (info) => {
    const { space_id } = info;
    const [error, data] = await axiosInstance.post('create/doc', {
      scene: 'doc',
      space_id,
      title: '无标题'
    });
    if (!error && data && data.docId) {
      await addRecent({
        spaceId: space_id,
        type: 'CreateEdit',
        docId: data.docId
      });
      await delay();
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
  const style = {
    fontSize: '14px',
    color: '#333',
    marginTop: '10px'
  };
  return (
    <Modal
      subTitle="点击选择一个知识库"
      title="新建文档"
      footer={spaces.length > 0 ? 'none' : null}
      onCancel={onCancelModal}
      onConfirm={onConfirmModal}
      confirmText="创建知识库"
      visible={visible} >
      {spaces.length > 0 ? spacesList : <div style={style}>您还未创建过知识库哟，文档存在知识库里。分好类，好查询</div>}
    </Modal>
  );
};