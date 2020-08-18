import React, { useCallback, useState, useContext } from 'react';
import { Input, Select, Button } from 'xigua-components/dist/js';
import { catalogContext } from '@context/catalog-context';
import { createNewDoc } from '@util/commonFun';
import { parseUrlQuery, getIn } from '@util/util';
import useMessage from '@hooks/use-message';

const lists = [{
  id: 'doc',
  text: '文档节点'
}, {
  id: 'empty_node',
  text: '目录节点'
}];

/**
  * 目录编排时新建文档块
  * @param {level} Number - 当前新建目录的目录的等级
  * @param {id} String - 新建目录项临时id
*/
export default function CreateInputContent({
  level = 0,
  id
}) {
  const message = useMessage();
  const { info: { catalog, docs }, updateCatalog } = useContext(catalogContext);
  // 文档标题
  const [value, setValue] = useState('无标题');
  // 正在创建文档
  const [loading, setLoading] = useState(false);
  // 文档类型
  const [type, setType] = useState('doc');

  const onChange = useCallback((e) => {
    setValue(e.currentTarget.value);
  }, []);

  const onCreate = useCallback(async () => {
    if (loading) {
      return;
    }
    const { spaceId } = parseUrlQuery();
    const index = catalog.findIndex(n => n.docId === id);
    const catalogInfo = {
      folderDocId: index <= 1 ? 'top' : catalog[index - 1].docId,
      level
    };
    setLoading(true);
    const [, data] = await createNewDoc({
      title: value,
      space_id: spaceId,
      scene: type,
      catalogInfo
    });
    setLoading(false);
    const docId = getIn(data, ['docId']);
    const docInfo = getIn(data, ['docInfo']);
    if (docId) {
      message.success({ content: '创建成功' });
      const newCatalog = catalog.slice(0);
      newCatalog[index].docId = docId;
      updateCatalog({ catalog: newCatalog, docs: [...docs, docInfo] });
    }
  }, [value, type, level, catalog, docs, loading, id]);

  const onCancle = useCallback(() => {
    updateCatalog({ catalog: catalog.filter(n => n.docId !== id) });
  }, [catalog, id]);

  const onSelect = useCallback((e, result) => {
    setType(result.id);
  }, []);

  return <div className="catalog-content catalog-content__create">
    <Input
      w="80%"
      h="100%"
      defaultFocus={true}
      defaultValue="无标题"
      onChange={onChange}
      className="catalog-content__input" />
    <Select
      className="catalog-input__select"
      defaultKey={type}
      onSelect={onSelect}
      lists={lists} />
    <Button
      content="确认"
      loading={loading}
      disabled={loading}
      className="catalog-input__confirm"
      onClick={onCreate}
      type="primary" />
    <Button
      content="取消"
      loading={loading}
      disabled={loading}
      className="catalog-input__cancle"
      onClick={onCancle} />
  </div>;
}