import React from 'react';
import { NavLink } from 'react-router-dom';
import './index.css';

/**
* @description 面包屑导航
* @props {crumbs} 配置
* @props {className} String 自定义类名
*/
export default function Breadcrumb(props) {
  const {
    className = '',
    crumbs = []
  } = props;
  if (!Array.isArray(crumbs) || crumbs.length === 0) {
    return null;
  }
  const createNavLink = ({ text, pathname }) => {
    return <NavLink to={pathname}
      activeStyle={{ color: '#262626', fontWeight: 'bold' }}>{text}</NavLink>;
  };
  const _crumbs_ = crumbs.filter(n => !!n.text);
  const crumbsJsx = _crumbs_.map((n, i) => {
    return <div className="Breadcrumb_Item"
      key={i}>
      {n.render ? n.render(n) : createNavLink(n)}
      {(i !== _crumbs_.length - 1) && <span>/</span>}
    </div>;
  });
  return (
    <div className={`Breadcrumb flex ${className}`}>
      {crumbsJsx}
    </div>
  );
};