import React, { useContext, useState } from 'react';
// import Icon from '../icon/icon.js';
import userContext from '../../context/user/userContext.js';
import './index.css';

export default function Footer() {
  const { userInfo } = useContext(userContext);
  const [showPopover, change] = useState(false);
  console.log(showPopover, change);
  console.log('userInfo:', userInfo);
  return (
    <div className="Footer_Wrapper">
    </div>
  );
};