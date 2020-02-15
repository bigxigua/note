import React from 'react';
import Tooltip from '@common/tooltip';
import Icon from '@common/icon';
import List from '@common/list';
import Popover from '@components/popover';
import { NavLink } from 'react-router-dom';
import { isEmptyObject } from '@util/util';

const settingList = [{
  text: '删除',
  icon: 'delete',
  key: 'delete'
}, {
  text: '在此建立新文档',
  icon: 'file-add',
  key: 'file-add'
}];

const activeStyle = {
  fontWeight: 'bold',
  color: '#25b864'
};

function onSetting(e) {
  console.log(e);
}

function SettingContent() {
  return <List list={settingList} />;
}

// 渲染目录项
function renderCatalogItem(type, doc, isFolder) {
  const cls = 'bookcatalog ellipsis';
  return type.toLocaleUpperCase() === 'EMPTY_NODE'
    ? <Tooltip className={cls}
      tips="空节点">
      <span>{doc.title}</span>
    </Tooltip>
    : <NavLink
      to={'/article' + doc.url.split('article')[1]}
      exact
      className={cls}
      activeStyle={activeStyle}>
      {doc.title}
      {
        isFolder && <Popover
          className="bookcatalog-setting"
          content={<SettingContent />}>
          <Icon
            type="setting"
            onClick={onSetting} />
        </Popover>
      }
    </NavLink>;
}

export function addIsOpenProperty(catalog, path, status = true, targetId = '') {
  function recursion(data, __path__) {
    return data.map((item, index) => {
      if (index === __path__[0]) {
        if (status) {
          item.isOpen = true;
        } else if (item.docId === targetId) {
          item.isOpen = false;
        }
        item.children = recursion(item.children, __path__.slice(1));
      }
      return item;
    });
  }
  return recursion(catalog, path);
}

export function renderCatalogs(catalog = [], docs, onToggleExpandCatalog) {
  function recursion(data) {
    let result = [];
    data.forEach((item, index) => {
      const doc = docs.find(n => n.doc_id === item.docId) || {};
      const isFolder = item.children.length > 0;
      let classes = 'bookcatalog-item flex ';
      classes += `${item.isOpen ? 'bookcatalog-item__open' : ''} `;
      classes += `${isFolder ? 'bookcatalog-item__parent' : ''} `;
      if (isEmptyObject(doc)) {
        return null;
      }
      result.push(<div
        key={item.docId}
        style={{ left: `${Math.min(item.level, 3) * 10}px` }}
        className={$.trim(classes)}>
        {isFolder && <Icon
          onClick={() => { onToggleExpandCatalog(catalog, item, index); }}
          type="caret-down" />}
        {renderCatalogItem(item.type, doc, isFolder)}
      </div>);
      if (item.children.length && item.isOpen) {
        result = result.concat(recursion(item.children));
      }
    });
    return result;
  }
  return recursion(catalog);
}