import React, { useEffect, useState, useCallback } from 'react';

export default function ShareHeader({ docInfo = {} }) {
  return <div className="share-header">
    <div className="share-header__content">
      <div className="share-header__left">
        <a className="share-header__logo"
          href="/"></a>
        <span>{docInfo.title}</span>
      </div>
      <div className="share-header__right"></div>
    </div>
  </div>;
}