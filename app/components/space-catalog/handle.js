import React, { useCallback, useContext } from 'react';
import { Icon, List, Popover } from 'xigua-components/dist/js';
import { isEmptyObject, delay } from '@util/util';
import { createNewDoc } from '@util/commonFun';
import { createDocByTemplate } from '@util/commonFun2';
import useMessage from '@hooks/use-message';
import articleContext from '@context/article/articleContext';

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

/* 文章目录组件
* @param {array} catalogs - 按照层级结构格式化好的当前的文档目录数据
* @param {boolean} loading - 正在加载获取文档信息
* @param {function} onToggleExpandCatalog - 展开/收起目录
*/
export function CatalogsComponent({
  loading,
  catalogs = [],
  onToggleExpandCatalog
}) {
  const { docs = [], updateStoreCurrentDoc } = useContext(articleContext);
  if (loading) {
    return <Icon type="loading" />;
  }
  const onClickHanlde = useCallback((doc) => {
    updateStoreCurrentDoc(docs.find(n => n.doc_id === doc.doc_id) || {});
    window.history.pushState({}, '', `${doc.doc_id}?spaceId=${doc.space_id}`);
  }, [docs]);
  function recursion(data) {
    let result = [];
    data.forEach((item, index) => {
      const { docId, children = [] } = item;
      const doc = docs.find(n => n.doc_id === docId) || {};
      const isFolder = children.length > 0;
      const isActive = new RegExp(`/article/${docId}`).test(window.location.pathname);
      let classes = 'bookcatalog-item ';
      classes += `${item.isOpen ? 'bookcatalog-item__open' : ''} `;
      classes += `${isFolder ? 'bookcatalog-item__folder' : ''} `;
      if (isEmptyObject(doc)) {
        return null;
      }
      result.push(<div
        key={`${item.docId}-${index}`}
        style={{ paddingLeft: `${Math.min(item.level, 3) * 10}px` }}
        className={$.trim(classes)}>
        {isFolder && <Icon
          onClick={() => { onToggleExpandCatalog(item, index); }}
          type="caret-down" />}
        <div className={`bookcatalog ellipsis ${isActive ? 'bookcatalog-active' : ''}`}
          onClick={() => { onClickHanlde(doc); }}>{doc.title}</div>
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
  return recursion(catalogs);
}