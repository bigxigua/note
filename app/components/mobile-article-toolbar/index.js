import React, { useState, useCallback, useEffect } from 'react';
import { Icon } from 'xigua-components/dist/js';
import { getCatalogs } from '@util/util';
import './index.css';

const actions = [{
  icon: '/images/catalog.png',
  text: '目录',
  key: 'catalog'
}];

function getOffset(data) {
  if (data.find(n => n.type === 'h1')) {
    return 0;
  } else if (data.find(n => n.type === 'h2')) {
    return -16;
  } else if (data.find(n => n.type === 'h3')) {
    return -32;
  } else if (data.find(n => n.type === 'h4')) {
    return -48;
  } else {
    return -64;
  }
}

function ArticleCatalog({
  html,
  setVisible,
  visible
}) {
  if (!visible) {
    return null;
  }
  const catalogs = getCatalogs(html);
  const classes = `mobile_catalogs-mask animated ${visible ? 'mobile_catalogs-show' : ''}`;

  const onItemClick = useCallback((e) => {
    const id = e.currentTarget.getAttribute('data-id');
    setVisible(false);
    if (!id || !$(`#${id}`).length) {
      return;
    }
    $('html, body').animate({
      scrollTop: $(`#${id}`).offset().top - 58
    }, 200);
    window.location.hash = id;
  });

  useEffect(() => {
    const id = window.location.hash;
    if (id && $(`${id}_catalog`).length) {
      const top = $(`${id}_catalog`).position().top;
      $('.mobile_catalogs').animate({ scrollTop: top }, 0);
    }
  }, []);

  return <div className={classes}
    onClick={(e) => { e.stopPropagation(); setVisible(false); }}>
    <div className="mobile_catalogs">
      <div className="mobile_catalogs-title">
        <span>目录</span>
        <Icon onClick={() => { setVisible(false); }}
          type="close" />
      </div>
      {catalogs.length === 0
        ? <div>该文档未定义目录</div>
        : catalogs.map(item => {
          const i = parseInt(item.type.substr(1));
          return <div
            key={item.index}
            data-id={item.id}
            onClick={onItemClick}
            id={`${item.id}_catalog`}
            className="mobile-toolbar__catalog"
            style={{ paddingLeft: `${(i - 1) * 16 + getOffset(catalogs)}px` }}>
            <span className={'catalog-item_' + item.type}>{item.text}</span>
            {/* <a href={`#${item.id}`}
              className={'catalog-item_' + item.type}>{item.text}
            </a> */}
          </div>;
        })
      }
    </div>
  </div>;
}

export default function MobileArticleToolbar({
  html = ''
}) {
  // 是否显示目录
  const [visible, setVisible] = useState(false);

  // toolbar点击事件处理函数
  const onActionClick = useCallback((item) => {
    const { key } = item;
    if (key === 'catalog') {
      setVisible(true);
    }
  }, []);

  if (!html) return null;

  return (
    <>
      <ArticleCatalog
        html={html}
        setVisible={setVisible}
        visible={visible} />
      <div className="mobile_toolbar">
        {
          actions.map(item => {
            return <div key={item.key}
              onClick={() => { onActionClick(item); }}
              className="mobile_toolbar_item">
              <img src={item.icon} />
            </div>;
          })
        }
      </div>
    </>
  );
};