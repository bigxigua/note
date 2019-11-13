import React, { useContext, useState } from 'react';
// import Icon from '../icon/icon.js';
// import userContext from '../../context/user/userContext.js';
import './index.css';

export default function Popover(props) {
  // const { userInfo } = useContext(userContext);
  // const [showPopover, change] = useState(false);
  return (
    <div className="Popover_Wrapper flex">
      <div className="Popover_Wrapper_Child">{props.children}</div>
      <div className="Popover_Wrapper_Content animated">{props.content}</div>
    </div>
  );
};