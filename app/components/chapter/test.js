const data = [{
  level: 0,
  docId: 'aa'
}, {
  level: 0,
  docId: 'bb'
}, {
  level: 1,
  docId: 'cc'
}, {
  level: 2,
  docId: 'dd'
}, {
  level: 2,
  docId: 'ddddd'
}, {
  level: 3,
  docId: 'ee'
}, {
  level: 0,
  docId: 'ff'
}];

// const data = [{
//   level: 0,
//   docId: 'bb'
// }, {
//   level: 1,
//   docId: 'cc'
// }, {
//   level: 2,
//   docId: 'dd'
// }, {
//   level: 2,
//   docId: 'ddddd'
// }];

function getEqualLevel(list, index, level) {
  const result = [];
  for (let i = index; i < list.length; i++) {
    if (list[i].level - level === 0) {
      result.push(list[i]);
    } else {
      break;
    }
  }
  return result;
}

function extraData(source) {
  const sourceData = source.slice(0);
  function recursion(data, minLevel) {
    const result = [];
    if (!data || data.length === 0 || !data[0]) {
      return [];
    }
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      if (item.level === minLevel && sourceData.findIndex(n => n.docId === item.docId) !== -1) {
        const newItem = {
          ...item,
          children: []
        };
        const sourceIndex = source.findIndex(n => n.docId === item.docId);
        const nextSource = getEqualLevel(source, sourceIndex + 1, item.level + 1);
        newItem.children.push(...recursion(nextSource, item.level + 1));
        result.push(newItem);
        sourceData.splice(sourceData.findIndex(n => n.docId === item.docId), 1);
      }
    };
    return result;
  }
  return recursion(source, 0);
};

console.log('---', extraData(data));
// extraData(data);