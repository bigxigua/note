import React from 'react';
import Tooltip from '@common/tooltip';
import Icon from '@common/icon';
import List from '@common/list';
import Popover from '@components/popover';
// import Modal from '@common/modal';
import { NavLink } from 'react-router-dom';
import { isEmptyObject, delay } from '@util/util';
import { createNewDoc } from '@util/commonFun';
import { createDocByTemplate } from '@util/commonFun2';
import useMessage from '@hooks/use-message';

const message = useMessage();

const settingList = [{
  text: '新建',
  icon: 'file-add',
  key: 'add'
}, {
  text: '从模版新建',
  icon: 'file-add',
  key: 'create-doc-by-template'
}];

const activeStyle = {
  fontWeight: 'bold',
  color: '#25b864'
};

function onSettingItemClick(e, info, curCatalogInfo, curDocInfo) {
  const { space_id, doc_id } = curDocInfo;
  const { level } = curCatalogInfo;
  const { key } = info;
  const catalogInfo = {
    folderDocId: doc_id,
    level: Math.min(3, level + 1)
  };
  e.stopPropagation();
  if (key === 'add') {
    createNewDoc({
      space_id,
      catalogInfo
    }, async ({ docId, spaceId }) => {
      if (docId && spaceId) {
        message.success({ content: '创建成功' });
        await delay();
        window.location.href = `/simditor/${docId}?spaceId=${spaceId}`;
      }
    });
  } else if (key === 'create-doc-by-template') {
    createDocByTemplate(space_id, catalogInfo);
  }
}

// 渲染目录项
function renderCatalogItem(type, doc) {
  const cls = 'bookcatalog ellipsis';
  return type.toLocaleUpperCase() === 'EMPTY_NODE'
    ? <span className={cls}> {doc.title}</span>
    : <NavLink
      to={'/article' + doc.url.split('article')[1]}
      exact
      className={cls}
      activeStyle={activeStyle}>
      {doc.title}
    </NavLink>;
}

// 展示/隐藏Popover
function popoverToggleOpen(open, cls) {
  $(`.${cls}`)[`${open ? 'add' : 'remove'}Class`]('bookcatalog-item__setting-open');
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
      let classes = 'bookcatalog-item ';
      classes += `${item.isOpen ? 'bookcatalog-item__open' : ''} `;
      classes += `${isFolder ? 'bookcatalog-item__folder' : ''} `;
      if (isEmptyObject(doc)) {
        return null;
      }
      result.push(<div
        key={item.docId}
        style={{ paddingLeft: `${Math.min(item.level, 3) * 10}px` }}
        className={$.trim(classes)}>
        {isFolder && <Icon
          onClick={() => { onToggleExpandCatalog(catalog, item, index); }}
          type="caret-down" />}
        {renderCatalogItem(item.type, doc)}
        {
          isFolder &&
          <Popover
            className={`bookcatalog-setting bookcatalog-setting_${item.docId}`}
            popoverToggleOpen={(e) => { popoverToggleOpen(e, `bookcatalog-setting_${item.docId}`); }}
            content={<List list={settingList}
              onTap={(info, index, event) => { onSettingItemClick(event, info, item, doc); }} />}>
            <Icon type="setting" />
          </Popover>
        }
      </div>);
      if (item.children.length && item.isOpen) {
        result = result.concat(recursion(item.children));
      }
    });
    return result;
  }
  return recursion(catalog);
}