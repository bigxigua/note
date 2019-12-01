export default {
  getSubWhencurIsFolder(destinationIndex, items, curOffset) {
    const sub = [];
    for (let i = destinationIndex; i < items.length; i++) {
      if (items[i].belong &&
        items[destinationIndex].offset !== curOffset &&
        (items[i].belong === items[destinationIndex].doc_id)) {
        sub.push(i);
      }
    }
  }
};