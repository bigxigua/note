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

const message = useMessage();

const ICON = {
  XIGUA: '/images/documentation.png',
  NORMAL: '/images/link.png'
};

/**
  * 快捷入口项目
  * @param {array}} entries - 快捷入口列表
  * @param {Function} onDelete -删除快捷入口成功时触发
*/
export default function ShortcutItems({
  entries = [],
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

  return entries.map(info => {
    return (
      <div
        key={info.id}
        className="shortcut-entrance__content-entry">
        <div className="shortcut-entrance__content-left">
          <img src={ICON[info.type || 'NORMAL']} />
          <a href={info.url}
            target="_blank">{info.title}</a>
        </div>
        <Popover
          content={
            <List
              onTap={onPopoverItemClick}
              list={createList(info)} />
          }>
          <Icon type="ellipsis"
            className="shortcut-entrance__content-icon" />
        </Popover>
      </div>);
  });
}