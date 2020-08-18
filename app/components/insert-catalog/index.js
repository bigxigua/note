import React, { useCallback, useState, useContext, useEffect } from 'react';
import { Modal, Select, Input } from 'xigua-components/dist/js';
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

/**
* 显示创建新文档节点的弹框
* @param {Boolean}  show 是否展示Modal
* @param {Object|Null} catalogInfo
*                   {string} folderDocId 父节点docId
*                   {number} level 层级
* @param {Function}  onModalHide Modal隐藏时触发
*/
export default function InsertCatalog({
  show = false,
  catalogInfo = {},
  onModalHide = () => { }
}) {
  const { spaceId = '' } = parseUrlQuery();
  const [id, setId] = useState('doc');
  const [title, setTitle] = useState('');
  const [visible, setvisible] = useState(show);
  const { info: { catalog = [], docs }, updateCatalog } = useContext(catalogContext);

  useEffect(() => {
    setvisible(show);
  }, [show]);

  // 确认创建
  const onConfirm = useCallback(() => {
    if (!title) {
      message.info({ content: '标题不合法' });
    }
    createNewDoc({
      space_id: spaceId,
      scene: id,
      catalogInfo,
      title
    }, async ({ docId }) => {
      if (!docId) return;
      setvisible(false);
      // const result = catalog.slice(1);
      const { folderDocId, level } = catalogInfo;
      const index = catalog.findIndex(n => n.docId === folderDocId);
      if (index !== -1) {
        const newCatalogs = catalog.slice(0);
        newCatalogs.splice(index + 1, 0, {
          type: id.toLocaleUpperCase(),
          docId,
          level,
          status: '1'
        });
        // 更新目录和文档在context内的信息
        updateCatalog({
          catalog: newCatalogs,
          docs: [...docs, {
            doc_id: docId,
            title,
            space_id: spaceId,
            status: '1'
          }]
        });
        // 接口更新目录
        updateCatalogService({
          spaceId,
          catalog: newCatalogs
        });
      }
    });
  }, [title, id, catalog, catalogInfo, docs]);

  const onCancel = useCallback(() => {
    setvisible(false);
    setId('doc');
    setTitle('');
    onModalHide();
  }, []);

  const onSelect = useCallback((e, result) => {
    setId(result.id);
  }, []);

  const onInput = useCallback((e) => {
    setTitle(e.currentTarget.value);
  }, []);

  return <>
    <Modal
      title="添加节点"
      subTitle="会将该节点插入到光标位置"
      visible={visible}
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
          defaultValue={title}
          placeholder="无标题" />
        <div className="insert_tips">{
          id === 'doc'
            ? '创建一个新的文档并设置其目录层级为当前节点位置'
            : '空节相当于目录，可以用于组织其他节点'
        }</div>
      </div>
    </Modal>
  </>;
};