import React, { useState, useCallback, Fragment } from 'react';
import Icon from '@common/icon';
import { getCatalogs } from '@util/util';
import './index.css';

const actions = [{
  icon: '/images/catalog.png',
  text: '目录',
  key: 'catalog'
}
  // , {
  //   icon: '/images/catalog.png',
  //   text: '收藏',
  //   key: 'collection'
  // }, {
  //   icon: '/images/catalog.png',
  //   text: '更多',
  //   key: 'more'
  // }
];

function renderCatalog(html, setVisible, visible) {
  const catalogs = getCatalogs(html);
  const classes = `mobile_catalogs-mask animated ${visible ? 'mobile_catalogs-show' : ''}`;
  const onItemClick = function () {
    setVisible(false);
  };
  return <div className={classes}>
    <div className="mobile_catalogs">
      <div className="mobile_catalogs-title">
        <span>目录</span>
        <Icon onClick={() => { setVisible(false); }}
          type="close" />
      </div>
      {catalogs.length === 0
        ? <div>该文档未定义目录</div> : catalogs.map(item => {
          return <div
            key={item.index}
            onClick={onItemClick}
            className="mobile_toolbar_catalog">
            <a href={`#${item.id}`}
              className={'catalog-item_' + item.type}>{item.text}
            </a>
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

  console.log(html);

  if (!html) return null;

  return (
    <Fragment>
      {renderCatalog(html, setVisible, visible)}
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
    </ Fragment>
  );
};