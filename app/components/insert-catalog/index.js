import React, { useCallback, useState, useContext, Fragment } from 'react';
import Modal from '@common/modal';
import Select from '@common/select';
import Input from '@common/input';
import { createNewDoc, updateCatalogService } from '@util/commonFun';
import { parseUrlQuery } from '@util/util';
import { catalogContext } from '@context/catalog-context';
import useMessage from '@hooks/use-message';
import './index.css';

const lists = [{
  id: 'doc',
  text: '新文档'
}, {
  id: 'empty_node',
  text: '空节点(可用作目录)'
}];
const message = useMessage();

export default function InsertCatalog({ position = {} }) {
  const { top, left, index, level } = position;
  const { spaceId = '' } = parseUrlQuery();
  const [state, setState] = useState({ visible: false });
  const [id, setId] = useState('doc');
  const { info: { catalog = [], docs }, updateCatalog } = useContext(catalogContext);

  // 展示Modal
  const onShowModal = useCallback(() => {
    setState({ ...state, visible: true });
  }, [state]);

  // 确认创建
  const onConfirm = useCallback(() => {
    const title = (state.value || '').trim();
    if (!title) {
      message.info({ content: '请输入标题' });
    }
    createNewDoc({
      space_id: spaceId,
      scene: id,
      title
    }, async ({ docId }) => {
      if (!docId) return;
      setState({ ...state, visible: false });
      const result = catalog.slice(1);
      result.splice(index + 1, 0, {
        docId,
        status: '1',
        type: id.toLocaleUpperCase(),
        level: parseInt(level)
      });
      // 更新目录
      updateCatalog({
        catalog: [catalog[0], ...result],
        docs: [...docs, { doc_id: docId, title, space_id: spaceId }]
      });
      // 调用接口更新目录
      updateCatalogService({ spaceId, catalog: [catalog[0], ...result] });
    });
  }, [catalog, index, level, id, state.value]);

  const onCancel = useCallback(() => {
    setState({
      ...state,
      visible: false,
      value: ''
    });
    setId('doc');
  }, [state]);

  const onSelect = useCallback((e, result) => {
    setId(result.id);
  }, []);

  const onInput = useCallback((e) => {
    setState({
      ...state,
      value: e.currentTarget.value
    });
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
      onCancel={onCancel}
      onConfirm={onConfirm}>
      <div className="insert_catalog_modal">
        <div className="insert_catalog_label">类型</div>
        <Select
          defaultKey={id}
          onSelect={onSelect}
          lists={lists} />
        <div className="insert_catalog_label">标题</div>
        <Input
          h={32}
          onChange={onInput}
          defaultValue={state.value}
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