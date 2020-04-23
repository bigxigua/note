import React, { useCallback, useState, useContext } from 'react';
import { catalogContext } from '@context/catalog-context';
import Popover from '@components/popover';
import InsertCatalog from '@components/insert-catalog';
import Icon from '@common/icon';
import List from '@common/list';
import './index.css';

const settingList = [{
  text: '删除',
  key: 'delete'
}, {
  text: '编辑',
  key: 'edit'
}, {
  text: '在此目录下新建',
  key: 'create'
}, {
  text: '将目标项添加到该目录下',
  key: 'move'
}];

// 获取当前目录的所有子元素的个数(包括子元素的子元素)
function getChildLength(item) {
  let len = 0;
  function recursive(children) {
    if (!Array.isArray(children) || !children.length) {
      return 0;
    }
    len += children.length;
    children.forEach(n => { recursive(n.children); });
    return len;
  }
  return recursive(item.children);
}

function getStyle(style, catalog, item) {
  const len = getChildLength(item);
  const { level } = item;
  return {
    ...style,
    height: len === 0 ? '36px' : `${(len + 1) * 44 + 11}px`,
    marginLeft: level !== 0 ? '32px' : 0
  };
}

function getOffsetImgClassName(curCatalogInfo, index, type) {
  const { level } = curCatalogInfo;
  const DISABLED_CLASS = 'chapter-item__move-disabled';
  if (type === 'left' /* 左移 */) {
    if (level === 0) {
      return DISABLED_CLASS;
    }
  } else {
    if (index === 0) {
      return DISABLED_CLASS;
    }
  }
  return '';
}

/**
  * 被拖拽的目录项
  * @param {object} provided - dnd provided
  * @param {ReactNode|Null} children - 内容元素
  * @param {index} Number - 在父目录下当前兄弟目录的下标
  * @param {object} docInfo -  当前目录对应的文档信息
  * @param {object} curCatalogInfo -  当前目录信息
  * @param {Function} onDelete - 删除该目录时触发
  * @param {Function} onOffsetChange -目录项左右移动时触发
*/
export default function CatalogDndItem({
  provided,
  children,
  index,
  childrenLen = 0,
  docInfo = {},
  curCatalogInfo = {},
  onDelete = () => { },
  onOffsetChange = () => { }
}) {
  const { info: { catalog = [] } } = useContext(catalogContext);
  // 创建新文档时在哪个目录下创建的, { folderDocId: '父节点docId', level: '当前新建文档的层级' }
  const [info, setInfo] = useState(null);
  const onPopoverItemClick = useCallback((info) => {
    const { doc_id: docId, space_id: spaceId, title } = docInfo;
    switch (info.key) {
      case 'edit':
        window.location.href = `/simditor/${docId}/?spaceId=${spaceId}`;
        break;
      case 'delete':
        onDelete(docId, title, spaceId);
        break;
      case 'create':
        setInfo({
          folderDocId: docId,
          level: curCatalogInfo.level + 1
        });
        break;
      default:
        break;
    }
  }, [docInfo, curCatalogInfo]);

  const onOffsetLeft = useCallback(() => {
    // TODO 如果存在subs，则对应的subs也要一起level--
    onOffsetChange(curCatalogInfo.docId, 'left');
  }, [curCatalogInfo]);

  const onOffsetRight = useCallback(() => {
    onOffsetChange(curCatalogInfo.docId, 'right');
  }, [curCatalogInfo]);

  let classes = `catalog-item catalog-item_${curCatalogInfo.docId}`;
  classes += childrenLen ? ' catalog-item_folder' : '';
  classes += `${docInfo.status === '0' ? ' chapter-item__disabled' : ''}`;
  return (
    <>
      <div className={classes}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={getStyle(provided.draggableProps.style, catalog, curCatalogInfo)}
      >
        {childrenLen ? <div className="catalog-item__right-border"></div> : null}
        <div className="catalog-content">
          <div className="flex">
            {children && <Icon type="caret-down" />}
            {docInfo.title}
          </div>
          <div className="chapter-item__info">
            <div className="chapter-item__move">
              <img src="/images/left.svg"
                onClick={onOffsetLeft}
                className={getOffsetImgClassName(curCatalogInfo, index, 'left')}
                title="左移" />
              <img src="/images/left.svg"
                onClick={onOffsetRight}
                className={getOffsetImgClassName(curCatalogInfo, index, 'right')}
                title="右移" />
            </div>
            <span>何时更新</span>
            <Popover
              className="chapter-item__setting"
              content={<List
                onTap={onPopoverItemClick}
                list={settingList} />}>
              <Icon type="ellipsis" />
            </Popover>
          </div>
        </div>
        {children || null}
      </div>
      <InsertCatalog
        show={Boolean(info)}
        catalogInfo={info}
        onModalHide={() => { setInfo(null); }} />
    </>
  );
};