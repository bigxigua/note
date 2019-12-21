import React from 'react';
import Icon from '@common/icon';
import './index.css';

const skeletons = [{
  width: 150,
  arrow: false
}, {
  width: 150,
  arrow: true,
  bg: '#ccc'
}, {
  width: 125,
  left: 24,
  arrow: false
}, {
  width: 150,
  bg: '#ccc',
  arrow: true
}, {
  width: 127,
  left: 24,
  arrow: false
}, {
  width: 127,
  left: 24,
  bg: '#ccc',
  arrow: true
}, {
  width: 102,
  left: 48,
  arrow: false
}, {
  width: 120,
  arrow: false
}, {
  width: 144,
  arrow: false
}, {
  width: 144,
  arrow: false
}];

export default function CatalogSkeleton() {
  return (
    <div className="catalog_skeleton_content">
      {
        skeletons.map((n, index) => {
          return (
            <div
              style={{ width: `${n.width}px`, left: `${n.left || 0}px` }}
              className="catalog_skeleton"
              key={index}>
              <div className="catalog_skeleton_icon">
                {n.arrow && <Icon type="caret-down" />}
              </div>
              <div
                style={{ backgroundColor: n.bg || '#eee' }}
                className="skeleton">
              </div>
            </div>
          );
        })
      }
    </div>
  );
};