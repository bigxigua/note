import React from 'react';
import ChapterDrop from './chapter-drop';
import './index.css';

export default function Chapter({
  spaceInfo = {}
}) {
  if (spaceInfo.docs.length === 0 || !spaceInfo.space.catalog) {
    return null;
  }
  // 服务端针对每个space保存一个json，用来描述这个space下属的文件的结构和顺序信息
  // 1.文档的展示顺序和json的结构顺序一致
  // 2. 调整顺序也是修改json数据顺序
  // 3. 调整文件为文件夹或者调整文件夹层级直接修改level属性
  // 4. 按顺序展示时，如果相邻2个元素level值不一样(且只能相差1)时，构造自己的childs
  let catalog = [];
  try {
    catalog = JSON.parse(spaceInfo.space.catalog);
  } catch (error) {
  }
  if (catalog.length === 0) {
    return null;
  }
  // const spaceStructure = [{
  //   display_level: 0, // 默认展示的层级
  //   max_level: 3, // 默认可创建的最大目录层级
  //   type: 'META' // 头一个为meta头部信息
  // }, {
  //   docId: '11', // 文档id
  //   title: '1111111', // 文档标题
  //   level: 0, // 展示的时候显示在哪个层级，比如level=0，显示在最左侧，level=1显示offset=40的位置
  //   type: 'DOC' // 文档类型
  // }, {
  //   docId: '22', // 文档id
  //   title: '2222222', // 文档标题
  //   level: 0, //
  //   type: 'DOC' // 文档类型
  // }, {
  //   docId: '33', // 文档id
  //   title: '3333333', // 文档标题
  //   level: 0, //
  //   type: 'DOC' // 文档类型
  // }, {
  //   docId: '44', // 文档id
  //   title: '44444444', // 文档标题
  //   level: 0, //
  //   type: 'DOC' // 文档类型
  // }, {
  //   docId: '55', // 文档id
  //   title: '5555555', // 文档标题
  //   level: 0, //
  //   type: 'DOC' // 文档类型
  // }, {
  //   docId: '66', // 文档id
  //   title: '66666666', // 文档标题
  //   level: 0, //
  //   type: 'DOC' // 文档类型
  // }];
  return (
    <div className="Chapter">
      <ChapterDrop
        catalog={catalog}
        space={spaceInfo.space}
        docs={spaceInfo.docs} />
    </div>
  );
};