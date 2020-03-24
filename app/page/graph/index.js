import React, { useEffect, useState, useCallback } from 'react';
import { Line } from '@antv/g2plot';
import Header from '@components/header/header';
import CatalogDragDrop from '@components/catalog-dragdrop/index';
import './index.css';

const data = [
  { time: '17:57', value: '40s' },
  { time: '18:04', value: '30s' },
  { time: '18:13', value: '53s' },
  { time: '18:30', value: '43s' },
  { time: '18:43', value: '40s' },
  { time: '18:48', value: '35s' },
  { time: '18:54', value: '35s' },
  { time: '18:59', value: '58s' },
  { time: '19:07', value: '50s' },
  { time: '19:14', value: '51s' },
  { time: '19:22', value: '50s' },
  { time: '19:28', value: '45s' },
  { time: '19:35', value: '58s' },
  { time: '19:47', value: '51s' },
  { time: '19:53', value: '35s' },
  { time: '20:00', value: '47s' },
  { time: '20:08', value: '45s' }
];

export default function Graph() {
  // useEffect(() => {
  //   const linePlot = new Line('graph', {
  //     title: {
  //       visible: true,
  //       text: '腹痛记录折线图'
  //     },
  //     description: {
  //       visible: true,
  //       text: '折线图用于表示腹痛的时间点以及腹痛时长'
  //     },
  //     data,
  //     xField: 'time',
  //     yField: 'value'
  //   });
  //   linePlot.render();
  // }, []);

  return (
    <>
      <Header />
      <CatalogDragDrop />
    </>
  );
}