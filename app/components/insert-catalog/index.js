import React, { useCallback, useState, Fragment } from 'react';
import Modal from '@common/modal';
import Select from '@common/select';
import Input from '@common/input';
import { createNewDoc } from '@util/commonFun';
import { parseUrlQuery } from '@util/util';
import './index.css';

const lists = [{
  id: 'doc',
  text: '新文档'
}, {
  id: 'empty_node',
  text: '空节点(可用作目录)'
}];

export default function InsertCatalog({ info = {}, catalog = [] }) {
  const { top, left, index } = info;
  const { spaceId = '' } = parseUrlQuery();
  const [state, setState] = useState({ visible: false });
  const [id, setId] = useState('doc');

  const onShowModal = useCallback(() => {
    setState({ ...state, visible: true });
  }, []);

  const onConfirm = useCallback(async () => {
    console.log('---', catalog, index, id, state.value);
    createNewDoc({ space_id: spaceId, scene: id, title: '' }, ({ docId }) => {
      console.log(docId);
    });
  }, [catalog, index, id, state.value]);

  const onSelect = useCallback((e, result) => {
    setId(result.id);
  }, []);

  const onInput = useCallback((e) => {
    setState({ ...state, value: e.currentTarget.value });
  }, [state]);

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
        <Select
          defaultKey="doc"
          onSelect={onSelect}
          lists={lists} />
        <div className="insert_catalog_label">标题</div>
        <Input h={32}
          onChange={onInput}
          placeholder="无标题" />
        <div className="insert_tips">{
          id === 'doc'
            ? '创建一个新的文档并设置其目录层级为当前节点位置'
            : '空节相当于目录，可以用于组织其他节点'
        }</div>
      </div>
    </Modal>
  </Fragment>;
};