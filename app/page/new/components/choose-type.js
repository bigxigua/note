import React, { useState, useCallback } from 'react';
import Dropdown from '@common/dropdown';
import Scene from '@common/scene';
import Input from '@common/input';
import Button from '@common/button';
import useMessage from '@hooks/use-message';
import { useHistory } from 'react-router-dom';
import axiosInstance from '@util/axiosInstance';
import { addRecent } from '@util/commonFun';
import { MenuItem, TEMPLATE_SCENCE, MENUS, TYPESCENES } from './handle';

function CreateMenu({ menus, onClick }) {
  const len = menus.length;
  return menus.map((n, i) => {
    return <MenuItem
      {...n}
      key={i}
      index={i}
      len={len}
      handle={onClick}
    />;
  });
}

export default function NewChooseType({
  setSpace
}) {
  const message = useMessage();
  const history = useHistory();
  const [menus, setMenus] = useState(MENUS);
  const [createLoading, setCreateLoading] = useState(false);
  const [typeScenes, setTypeSences] = useState(TYPESCENES);
  const [templateSences, setTemplateSences] = useState(TEMPLATE_SCENCE);
  const [info, setInfo] = useState(typeScenes[0]);

  // 切换可见范围事件
  const onClick = useCallback((index) => {
    setMenus(menus.map((n, i) => {
      return { ...n, checked: i === index };
    }));
  }, [menus]);

  // 切换模版事件
  const onTemplateScenesChange = (index, type, item) => {
    if (item.disabled) return;
    const _templateSences_ = templateSences.map((n, i) => {
      return { ...n, actived: type === 'default' ? false : i === index };
    });
    const _typeScenes_ = typeScenes.map((n, i) => {
      return { ...n, actived: type === 'template' ? false : i === index };
    });
    setTemplateSences(_templateSences_);
    setTypeSences(_typeScenes_);
    const _info_ = [..._templateSences_, ..._typeScenes_].filter(n => n.actived)[0];
    setSpace(_info_);
    setInfo(_info_);
  };

  // 输入框输入事件
  const onInputChange = useCallback((e, key) => {
    setInfo({
      ...info,
      [`${key}`]: e.currentTarget.value
    });
  }, [info]);

  // 提交
  const onCreateSpace = useCallback(async () => {
    if (createLoading) {
      return;
    }
    const {
      title: name,
      desc: description,
      scene
    } = info;

    if (!name || !description) {
      message.error({ content: '请先完善信息' });
      return;
    }
    setCreateLoading(true);
    const [error, data] = await axiosInstance.post('create/space', {
      name,
      description,
      public: menus.filter(n => n.checked)[0].public,
      scene
    });
    if (!error && data && data.spaceId) {
      await addRecent({ spaceId: data.spaceId, spaceName: name, type: 'CreateSpace' });
      message.success({ content: '创建成功', d: 500, onClose: () => history.push(`/spacedetail?spaceId=${data.spaceId}`) });
      setCreateLoading(false);
      return;
    }
    setCreateLoading(false);
    message.error({ content: (error || {}).message || '系统开小差啦，稍等试试吧' });
    console.log('[创建空间失败 ]', error);
  }, [info, menus]);

  const Overlay = <CreateMenu
    onClick={onClick}
    menus={menus} />;

  const subMenus = [{
    ...menus.filter(n => n.checked)[0],
    checked: false
  }];
  const TypeScenes = typeScenes.map((n, i) => {
    return <Scene
      {...n}
      onClick={(e) => onTemplateScenesChange(e, 'default', n)}
      index={i}
      key={i} />;
  });
  const TemplateScenes = templateSences.map((n, i) => {
    return <Scene
      {...n}
      onClick={(e) => onTemplateScenesChange(e, 'template', n)}
      index={i}
      key={i} />;
  });
  return (
    <div className="New_Choose">
      <h1>可见范围</h1>
      <Dropdown
        disabled={true}
        overlay={Overlay}
        trigger="click">
        <CreateMenu
          onClick={onClick}
          menus={subMenus} />
      </Dropdown>
      <div className="New_Scenes flex">
        {TypeScenes}
      </div>
      <h1>从模版新建</h1>
      <div className="New_Scenes New_Scenes_Template flex">
        {TemplateScenes}
      </div>
      <h1>名称</h1>
      <Input
        defaultValue={info.title}
        w={'100%'}
        onChange={(e) => { onInputChange(e, 'title'); }}
        className="New_Input" />
      <h1 style={{ marginTop: '10px' }}>简介</h1>
      <Input
        defaultValue={info.desc}
        type="textarea"
        h={'auto'}
        w={'100%'}
        onChange={(e) => { onInputChange(e, 'desc'); }}
        className="New_TextArea" />
      <Button
        className="create-button"
        particle={false}
        type="primary"
        loading={createLoading}
        disabled={createLoading}
        onClick={onCreateSpace}>新建</Button>
    </div>
  );
};