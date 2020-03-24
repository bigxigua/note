import React, { useCallback } from 'react';
import Popover from '@components/popover';
import Icon from '@common/icon';
import List from '@common/list';
import './index.css';

const settingList = [{
  text: '删除',
  icon: 'delete',
  key: 'delete'
}, {
  text: '编辑',
  icon: 'edit',
  key: 'edit'
}];

function getStyle(style, childrenLen) {
  const height = childrenLen === 0 ? '44px' : `${(childrenLen + 1) * 44 + 27}px`;
  return {
    ...style,
    minHeight: height
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
  onOffsetChange = () => { }
}) {
  const onPopoverItemClick = useCallback(() => {
  }, []);

  const onOffsetLeft = useCallback(() => {
    // TODO 如果存在subs，则对应的subs也要一起level--
    onOffsetChange(curCatalogInfo.docId, 'left');
  }, [curCatalogInfo]);

  const onOffsetRight = useCallback(() => {
    onOffsetChange(curCatalogInfo.docId, 'right');
  }, [curCatalogInfo]);

  let classes = `catalog-item catalog-item_${curCatalogInfo.docId}`;
  classes += ` catalog-item_${Math.min(curCatalogInfo.level, 3)}`;
  classes += `${docInfo.status === '0' ? ' chapter-item__disabled' : ''}`;

  return (
    <div className={classes}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided.draggableProps.style, childrenLen)}
    >
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
              onTap={(info, index, event) => { onPopoverItemClick(); }}
              list={settingList} />}>
            <Icon type="ellipsis" />
          </Popover>
        </div>
      </div>
      {children || null}
    </div>
  );
};