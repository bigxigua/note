import React, { useCallback, useState } from 'react';
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
}];

function getStyle(style, childrenLen, level) {
  const height = childrenLen === 0 ? '36px' : `${(childrenLen + 1) * 36 + 11}px`;
  return {
    ...style,
    minHeight: height,
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
        style={getStyle(provided.draggableProps.style, childrenLen, curCatalogInfo.level)}
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