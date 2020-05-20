import React, { useCallback, useState, useContext } from 'react';
import Input from '@common/input';
import Select from '@common/select';

const lists = [{
  id: 'doc',
  text: '文档节点'
}, {
  id: 'folder',
  text: '目录节点'
}];

export default function EmptyDocContent() {
  const [value, setValue] = useState('无标题');
  const [type, setType] = useState('doc');

  const onChange = useCallback((e) => {
    setValue(e.currentTarget.value);
  }, []);

  const onBlur = useCallback(() => {
    // 调用创建文档接口，成功后修改catalog
  }, [value]);

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
      onBlur={onBlur}
      className="catalog-content__input" />
    <Select
      className="catalog-content__select"
      defaultKey={type}
      onSelect={onSelect}
      lists={lists} />
  </div>;
}