import React, { useState, useCallback, useEffect } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import Modal from '@common/modal';
import Icon from '@common/icon';
import CreateDocFromTemplateModal from '@components/create-doc-from-template';
import axiosInstance from '@util/axiosInstance';
import { SPACE_TYPE_ICON } from '@config/index';
import { createNewDocAction } from '@util/commonFun';
import './index.css';

/**
* 新建文档通用组件
* @param {string} mode - 创建方法，枚举值，common-普通新建 template-从模版创建
* @param {boolean} visible - 是否展示当前Modal
* @param {string} spaceId - 当前空间id，可空，空值时显示空间列表
* @param {Function} onModalChange - modal关闭或展示时触发
*/
export default function CreateDoc({
  mode = 'common',
  spaceId = '',
  visible = false,
  onModalChange = () => { }
}) {
  // 正在请求获取空间列表接口
  const [loading, setLoading] = useState(false);
  // 空间列表
  const [spaces, setSpaces] = useState([]);
  // 控制是否展示模版modal
  const [canShowTemplateModal, setTemplateModalVisible] = useState(spaceId);
  // 当前选中的空间信息,spaceInfo.space_id存在显示模版选择Modal
  const [spaceInfo, setSpaceInfo] = useState({});
  const history = useHistory();

  // 隐藏空间列表Modal
  const onCancelModal = useCallback(() => {
    onModalChange(false);
  }, []);

  // 点击创建文档，显示modal
  const onChooseSpace = useCallback(async (info) => {
    const { space_id } = info;
    if (mode === 'template') {
      setSpaceInfo(info);
    } else if (mode === 'common') {
      createNewDocAction({ space_id });
    }
  }, [mode]);

  // 获取空间列表
  const fetchSpaces = useCallback(async () => {
    setLoading(true);
    const [error, data] = await axiosInstance.get('spaces', {});
    setLoading(false);
    if (error || !data || !Array.isArray(data.spaces) || data.spaces.length === 0) {
      return;
    }
    setSpaces(data.spaces);
  }, [mode]);

  useEffect(() => {
    fetchSpaces();
  }, [mode]);

  // spaceId存在表示已选定空间，不需要显示空间列表了
  if (spaceId) {
    return <CreateDocFromTemplateModal
      onHide={() => { setTemplateModalVisible(false); onModalChange(false); }}
      show={canShowTemplateModal}
      spaceId={spaceId} />;
  }

  const renderSpaceList = useCallback(() => {
    if (loading) {
      return <div className="create_loading">
        <Icon type="loading" />
        <span>正在加载...</span>
      </div>;
    }
    if (spaces.length === 0) {
      return <div className="create-modal__tips">
        您还未创建过知识库哟，
        <NavLink to="/new">去创建</NavLink>
        ,文档是存在知识库里。
      </div>;
    }
    return spaces.map(n =>
      <div
        onClick={() => { onChooseSpace(n); }}
        key={n.id}
        className="header-spaces__list flex">
        <img src={SPACE_TYPE_ICON[n.scene]} />
        <span style={{ maxWidth: 'calc(100% - 100px)' }}
          className="ellipsis">{n.name}</span>
      </div >
    );
  }, [loading, spaces]);

  return (
    <>
      <Modal
        subTitle="点击选择一个知识库"
        title="新建文档"
        footer={spaces.length > 0 ? 'none' : null}
        onCancel={onCancelModal}
        onConfirm={() => { history.push('/new'); }}
        confirmText="创建知识库"
        visible={visible} >
        {renderSpaceList()}
      </Modal>
      <CreateDocFromTemplateModal
        onHide={() => { setTemplateModalVisible(false); }}
        show={canShowTemplateModal}
        spaceId={spaceInfo.space_id} />
    </>
  );
};