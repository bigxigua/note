import React, { useCallback, useState, Fragment } from 'react';
import Modal from '@common/modal';
import Select from '@common/select';
import './index.css';

const lists = [{
  id: 'doc',
  text: '新文档'
}, {
  id: 'catalog',
  text: '空节点(可用作目录)'
}];

export default function InsertCatalog({ style = {} }) {
  const { top, left } = style;
  const [state, setState] = useState({
    visible: true
  });

  const onShowModal = useCallback(() => {
    setState({ ...state, visible: true });
  }, []);

  const onConfirm = useCallback(() => { }, []);

  return <Fragment>
    <div
      className="Catalog_Add flex"
      style={{ top: `${top}px`, left: `${left}px` }}>
      <img onClick={onShowModal}
        src="/images/add.svg" />
      <img src="/images/cursor.svg" />
    </div>
    <Modal
      title="添加节点"
      subTitle="会将该节点插入到光标位置"
      visible={state.visible}
      onCancel={() => setState({ ...state, visible: false })}
      onConfirm={onConfirm}>
      <div className="insert_catalog_modal">
        <div className="insert_catalog_label">类型</div>
        <Select defaultValue="新文档"
          lists={lists} />
      </div>
    </Modal>
  </Fragment>;
};