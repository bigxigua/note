import React, { useCallback, useState, useContext } from 'react';
import Popover from '@components/popover';
import InsertCatalog from '@components/insert-catalog';
import { catalogContext } from '@context/catalog-context';
import Icon from '@common/icon';
import List from '@common/list';
import { getStyle, getOffsetImgClassName, exChange } from './function';
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

// 被选中的目录项
let selectedCatalog = {};

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
  // 创建新文档时在哪个目录下创建的, { folderDocId: '父节点docId', level: '当前新建文档的层级' }
  const { info: { catalog }, updateCatalog } = useContext(catalogContext);
  const [info, setInfo] = useState(null);
  const [settings, updateSetting] = useState(settingList);
  const onPopoverItemClick = useCallback((info, d, e) => {
    e.stopPropagation();
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
      case 'move': {
        const targetIndex = catalog.findIndex(n => n.docId === docId);
        const sourceIndex = catalog.findIndex(n => n.docId === selectedCatalog.docId);
        // 判断当前curCatalogInfo是否是selectedCatalog的子元素
        if (selectedCatalog.docId !== docId && targetIndex > 0 && sourceIndex > 0) {
          const newCatalogs = exChange(catalog, selectedCatalog, curCatalogInfo);
          updateCatalog({ catalog: newCatalogs });
        };
      }
        break;
      default:
        break;
    }
  }, [docInfo, curCatalogInfo]);

  const onOffsetLeft = useCallback((e) => {
    e.stopPropagation();
    onOffsetChange(curCatalogInfo.docId, 'left');
  }, [curCatalogInfo]);

  const onOffsetRight = useCallback((e) => {
    e.stopPropagation();
    onOffsetChange(curCatalogInfo.docId, 'right');
  }, [curCatalogInfo]);

  // 目录项被点击选中，用来做插入标记
  const onCatalogItemClick = useCallback((e) => {
    e.stopPropagation();
    const { docId } = curCatalogInfo;
    const currentClass = `.catalog-item_${docId}`;
    $(`.catalog-item:not(${currentClass})`).removeClass('catalog-item__selected');
    $(currentClass).toggleClass('catalog-item__selected');
    selectedCatalog = curCatalogInfo;
  }, [curCatalogInfo, settings]);

  let classes = `catalog-item catalog-item_${curCatalogInfo.docId}`;
  classes += childrenLen ? ' catalog-item__folder' : '';
  classes += `${docInfo.status === '0' ? ' chapter-item__disabled' : ''}`;
  return (
    <>
      <div className={classes}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={onCatalogItemClick}
        style={getStyle(provided.draggableProps.style, curCatalogInfo)}
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
                list={settings} />}>
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