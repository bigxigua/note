import React, { useRef, useState, useEffect } from 'react';
import method from './method';
import './index.css';

const loop = () => { };

const ICON_MAP = {
  success: <svg
    viewBox="64 64 896 896"
    focusable="false"
    data-icon="check-circle"
    width="1em"
    height="1em"
    fill="#52c41a"
    aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg>,
  error: <svg
    viewBox="64 64 896 896"
    focusable="false"
    className=""
    data-icon="close-circle"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg>,
  loading: <img src="" />,
  warning: <img src="" />,
  info: <img src="" />
};

/**
* 全局展示操作反馈信息。
* @param {string} type - 反馈类型，支持success、error、info、loading、warning
* @param {ReactNode} content - 提示内容
* @param {number} duration - 自动关闭的延时，单位秒。设为 0 时不自动关闭。default 3
* @param {ReactNode} icon - 自定义图标
* @param {boolean} show - 是否展示
* @param {Function} onClose - 关闭时触发的回调函数
*/
export default function Message({
  type = 'success',
  content = '',
  duration = 2,
  icon = '',
  onClose = loop,
  show = false
}) {
  const cls = $.trim('message-box animated slideInDown');
  const messageRef = useRef(null);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    console.log('-------', type);
    const timer = setTimeout(() => {
      // $(messageRef.current).unwrap().remove();
    }, duration * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return notices.map((item, index) => {
    return (
      <div
        key={index}
        ref={messageRef}
        className="message">
        <div className={cls}>
          {icon}
          <span className="message-content">{content || ''}</span>
        </div>
      </div>
    );
  });
};

Message.success = method('success');
// Message.info = method('info');
// Message.error = method('error');
// Message.loading = method('loading');