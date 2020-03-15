import React, { useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Popover from '@components/popover';
import List from '@common/list';
import Icon from '@common/icon';
import axiosInstance from '@util/axiosInstance';
import { getIn } from '@util/util';
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
    if (!result.destination) return;
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
    // 拖放结束，原本被放置位置的的元素
    // lists[sourceIndex].order_num = destinationOrderNum;
    // lists[destinationIndex].order_num = sourceOrderNum;
    const [removed] = lists.splice(sourceIndex, 1);
    lists.splice(destinationIndex, 0, removed);
    console.log('lists:', lists);

    // setEntries(lists.sort((a, b) => a.order_num - b.order_num));
    setEntries(lists);
    const [error, data] = await axiosInstance.post('shortcut/order', {
      sourceShortcutId,
      sourceOrderNum,
      destinationShortcutId,
      destinationOrderNum
    });
    if (error || getIn(data, ['STATUS']) !== 'OK') {
      setEntries(entries);
      message.error({ content: getIn(error, ['message'], '更新排序失败') });
    }
  }, [entries]);

  const jumpToEditor = useCallback((url) => {
    window.location.href = url.replace(/\/article\//, '/simditor/');
  }, []);

  function renderDraggables(provided, snapshot) {
    return <div
      {...provided.droppableProps}
      ref={provided.innerRef}>
      {
        entries.map((info, index) => {
          return (
            <Draggable
              key={info.shortcut_id}
              index={index}
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
                    <a href={info.url}
                      target="_blank">{info.title}-{info.shortcut_id}-{info.order_num}</a>
                  </div>
                  <div className="shortcut-entrance__content-right">
                    {info.type === 'XIGUA_DOC' && <Icon type="edit"
                      onClick={() => { jumpToEditor(info.url); }} />}
                    {info.type === 'XIGUA_SPACE' && <a
                      content="编排"
                      target="_blank"
                      href={`${info.url}&type=toc`}
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