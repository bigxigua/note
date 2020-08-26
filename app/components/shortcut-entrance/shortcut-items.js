import React, { useCallback, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { List, Icon, Popover } from 'xigua-components/dist/js';
import axiosInstance from '@util/axiosInstance';
import { getIn, transformIpToDomain } from '@util/util';
import useMessage from '@hooks/use-message';

function createList(info) {
  return [{
    text: '删除入口',
    key: 'remove',
    icon: 'delete',
    info
  }];
};

function getStyle(style) {
  return {
    ...style,
    transitionDuration: '0'
  };
}

function getJumpUrl(info) {
  const { url, type } = info;
  if (type === 'XIGUA_DOC') {
    return transformIpToDomain(url.replace(/\/article\//g, '/simditor/'));
  } else if (type === 'XIGUA_SPACE') {
    return transformIpToDomain(url);
  } else {
    return url;
  }
}

const message = useMessage();

const ICON = {
  XIGUA_SPACE: '/images/warehouse.png',
  XIGUA_DOC: '/images/documentation.png',
  NORMAL: '/images/link.png'
};

/**
  * 快捷入口项目
  * @param {array}} entries - 快捷入口列表
  * @param {Function} onDelete -删除快捷入口成功时触发
*/
export default function ShortcutItems({
  entries = [],
  setEntries = () => { },
  onDelete = () => { }
}) {
  // 用来控制正在掉排序接口进行排序设置，设置过程中不可拖动。
  const [isFetching, setFetch] = useState(false);
  // 删除快捷入口
  const removeShortcut = useCallback(async (shortcutId) => {
    const [error, data] = await axiosInstance.post('delete/shortcut', { shortcutId });
    if (getIn(data, ['STATUS']) === 'OK') {
      onDelete(shortcutId);
      return;
    }
    message.error({ content: getIn(error, ['message']) });
  }, [entries]);

  // popover点击事件
  const onPopoverItemClick = useCallback(async (data = {}) => {
    const { key, info } = data;
    if (key === 'remove') {
      removeShortcut(info.shortcut_id);
    }
  }, [entries]);

  // 拖放位置更新
  const onDragUpdate = useCallback(() => {
  }, [entries]);

  // 拖放动作结束，更新orderNum，重新排序
  const onDragEnd = useCallback(async (result) => {
    if (!result.destination || isFetching) {
      return;
    };
    const {
      source: { index: sourceIndex }, // 当前drag元素位置
      destination: { index: destinationIndex } // 被放下位置
    } = result;
    if (sourceIndex === destinationIndex) {
      return;
    }
    const { shortcut_id: sourceShortcutId, order_num: sourceOrderNum } = entries[sourceIndex];
    const { shortcut_id: destinationShortcutId, order_num: destinationOrderNum } = entries[destinationIndex];

    const lists = entries.slice(0);

    if (sourceIndex < destinationIndex /* 下移 */) {
      for (let i = sourceIndex + 1; i <= destinationIndex; i++) {
        lists[i].order_num--;
      }
    }
    // `update shortcut set order_num=order_num-1 where order_num BETWEEN ${sourceOrderNum + 0.1} AND ${destinationOrderNum}`
    if (sourceIndex > destinationIndex /* 上移 */) {
      for (let i = destinationIndex; i <= sourceIndex - 1; i++) {
        lists[i].order_num++;
      }
    }
    // `update shortcut set order_num=order_num+1 where order_num BETWEEN ${destinationOrderNum} AND ${sourceOrderNum - 0.1}`

    // 下移，在destinationIndex之后添加，上移在destinationIndex之前添加
    const [removed] = lists.splice(sourceIndex, 1);
    removed.order_num = destinationOrderNum;
    lists.splice(destinationIndex, 0, removed);

    setEntries(lists);
    setFetch(true);
    const [error, data] = await axiosInstance.post('shortcut/order', {
      sourceShortcutId,
      sourceOrderNum,
      destinationShortcutId,
      destinationOrderNum
    });
    setFetch(false);
    if (error || getIn(data, ['STATUS']) !== 'OK') {
      // 设置失败，显示原样
      setEntries(entries);
      message.error({ content: getIn(error, ['message'], '更新排序失败') });
    }
  }, [entries, isFetching]);

  function renderDraggables(provided) {
    return <div
      {...provided.droppableProps}
      ref={provided.innerRef}>
      {
        entries.map((info, index) => {
          return (
            <Draggable
              key={info.shortcut_id}
              index={index}
              isDragDisabled={isFetching}
              draggableId={String(info.shortcut_id)}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getStyle(provided.draggableProps.style)}
                  className="shortcut-entrance__content-entry">

                  <div className="shortcut-entrance__content-left">
                    <img src={ICON[info.type || 'NORMAL']} />
                    <a href={getJumpUrl(info)}
                      rel="noopener noreferrer"
                      target="_blank">{info.title}</a>
                  </div>
                  <div className="shortcut-entrance__content-right">
                    {info.type === 'XIGUA_DOC' && <a href={transformIpToDomain(info.url)}
                      target="_blank">查看</a>}
                    {info.type === 'XIGUA_SPACE' && <a
                      target="_blank"
                      href={`${transformIpToDomain(info.url)}`}
                    >管理</a>}
                    <Popover
                      content={
                        <List
                          onTap={onPopoverItemClick}
                          list={createList(info)} />
                      }>
                      <Icon type="ellipsis"
                        className="shortcut-entrance__content-icon" />
                    </Popover>
                  </div>
                </div>)}
            </Draggable>);
        })}
    </div>;
  }

  return (
    <DragDropContext
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}>
      <Droppable
        ignoreContainerClipping={true}
        droppableId="shortcut-entrance">
        {renderDraggables}
      </Droppable>
    </DragDropContext>
  );
}