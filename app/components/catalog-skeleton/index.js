import React from 'react';
import Icon from '@common/icon';
import './index.css';

const skeletons = [{
  width: 180,
  arrow: false,
  bg: '#ccc'
}, {
  width: 200,
  arrow: true
}, {
  width: 160,
  left: 24,
  arrow: false
}, {
  width: 210,
  bg: '#ccc',
  arrow: true
}, {
  width: 160,
  left: 24,
  arrow: false
}, {
  width: 140,
  left: 24,
  arrow: true
}, {
  width: 140,
  left: 48,
  arrow: false
}, {
  width: 180,
  arrow: false
}, {
  width: 140,
  arrow: false
}, {
  width: 160,
  arrow: false
}, {
  width: 140,
  arrow: true
}, {
  width: 180,
  left: 24,
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