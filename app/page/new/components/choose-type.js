import React, { useState } from 'react';
import Dropdown from '@common/dropdown';
import Scene from '@common/scene';
import Icon from '@common/icon';
import Input from '@common/input';

function MenuItem({ type, text, checked, len, handle, index }) {
  let className = '';
  if (len > 1) {
    className = checked ? 'New_Permission_Checked' : '';
    className += ' New_Permission_Mul';
  } else {
    className = 'New_Permission_Show';
  }
  const onClick = () => {
    if (len > 1) {
      handle(index);
    }
  };
  return (
    <div
      className={`New_Permission flex ${className}`}
      onClick={onClick}>
      <Icon type={type} />
      <p>{text}</p>
      <Icon type={len === 1 ? 'down' : checked ? 'check' : ''} />
    </div>
  );
};

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

export default function NewChooseType() {
  const [menus, setMenus] = useState([{
    type: 'stop',
    text: '仅自己可见',
    checked: true
  }, {
    type: 'global',
    text: '互联网可见'
  }]);
  const [typeScenes, setTypeSences] = useState([{
    icon: <img src="/images/book.png" />,
    title: '文档知识库',
    desc: '创作在线文档',
    actived: true
  }, {
    icon: <img src="/images/books.png" />,
    title: '资源知识库',
    desc: '上传并预览知识库'
  }, {
    icon: <img src="/images/import.png" />,
    title: '导入',
    desc: '新建并导入本地内容'
  }]);
  const [templateSences, setTemplateSences] = useState([{
    icon: <img src="/images/doc.png" />,
    title: '学习笔记',
    desc: '点滴学习，随时记录'
  }, {
    icon: <img src="/images/blog.png" />,
    title: '博客专栏',
    desc: '定时总结，与人分享，加深记忆'
  }, {
    icon: <img src="/images/trip.png" />,
    title: '旅行攻略',
    desc: '行程单、预算、游记'
  }]);
  const [info, setInfo] = useState(typeScenes[0]);
  // 切换可见范围事件
  const onClick = (index) => {
    setMenus(menus.map((n, i) => {
      return { ...n, checked: i === index };
    }));
  };
  // 切换模版事件
  const onTemplateScenesChange = (index, type) => {
    setTemplateSences(templateSences.map((n, i) => {
      return { ...n, actived: type === 'default' ? false : i === index };
    }));
    setTypeSences(typeScenes.map((n, i) => {
      return { ...n, actived: type === 'template' ? false : i === index };
    }));
    const _info_ = [...typeScenes, ...templateSences].filter(n => n.actived)[0];
    setInfo(_info_);
  };
  // 输入框输入事件
  const onInputChange = (e, key) => {
    const value = e.currentTarget.value;
    setInfo({
      ...info,
      [`${key}`]: value
    });
  };
  // 提交
  const onCreateSpace = () => {

  };
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
      onClick={(e) => onTemplateScenesChange(e, 'default')}
      index={i}
      key={i} />;
  });
  const TemplateScenes = templateSences.map((n, i) => {
    return <Scene
      {...n}
      onClick={(e) => onTemplateScenesChange(e, 'template')}
      index={i}
      key={i} />;
  });
  return (
    <div className="New_Choose">
      <h1>可见范围</h1>
      <Dropdown
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
        onChange={(e) => { onInputChange(e, 'title'); }}
        className="New_Input" />
      <h1>简介</h1>
      <Input
        defaultValue={info.desc}
        type="textarea"
        onChange={(e) => { onInputChange(e, 'desc'); }}
        className="New_TextArea" />
      <button
        className="New_Button"
        onClick={onCreateSpace}>新建</button>
    </div>
  );
};