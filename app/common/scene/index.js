import React from 'react';
import './index.css';
// import Icon from '@common/icon';

export default function Scene({
  icon,
  title,
  desc,
  index,
  actived = false,
  onClick = console.log
}) {
  const onClickHandle = () => {
    if (!actived) {
      onClick(index);
    }
  };
  return (
    <div
      onClick={onClickHandle}
      className={`Scene flex ${(actived || '') && 'Scene_Actived'}`}>
      <div className="Scene_Img flex">
        {icon}
      </div>
      <div className="Scene_Content">
        <h6>{title}</h6>
        <p>{desc}</p>
      </div>
    </div>
  );
};