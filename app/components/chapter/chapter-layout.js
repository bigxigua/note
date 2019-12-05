import { getIn } from '@util/util';

const OFFSET = [40, 80, 120];
const BASE_CLASS = '.Chapter_Item';
const DASH_CLASS = '.Chapter_Item_Dash';

export default function ChapterLayout() {
}
ChapterLayout.prototype = {
  /**
  * @description 初始化
  * @param {Array} items 目录结构json
  */
  init({ items }) {
    this.draggableElementsInfo = null;
    this.draggingFromThisWith = null;
    this.chapterBoxRef = document;
    this.items = [].concat(items);
    this.onMousemove = this.onMousemove.bind(this);
  },
  /**
  * @description
  * 判断当前项是否需要显示下拉展开图标进行下拉收起操作
  * @param  {Object} item 当前项数据
  * @param  {Number} index 当前项在items的下标
  * @param  {Array}  list items
  * @return {Boolean} result 结果
  */
  whetherDisplayCaretDown(item, index, list) {
    const items = list.filter(n => n.type !== 'META');
    if (index === items.length - 1) {
      return false;
    }
    if (item.level < items[index + 1].level) {
      return true;
    }
  },
  /**
  * @description 获取目录元素的位置
  * @param {Array} items 目录结构json
  * @return {Num} result 结果
  */
  getElementPos() {
    return Array.from(document.querySelectorAll(BASE_CLASS)).map((n, i) => {
      const { x, y, width, height } = n.getBoundingClientRect();
      const id = n.getAttribute('data-tbid');
      const m = 8;
      return {
        x,
        y,
        id,
        w: width,
        h: height,
        index: i,
        folder: false,
        calcSection: (p) => {
          return p > y && p <= y + height + m;
        }
      };
    });
  },
  getTargetClassName: function(target) {
    if (!target) {
      return [];
    }
    const c = target.getAttribute('class');
    if (!c || /^\s+$/.test(c)) {
      return this.getTargetClassName(target.parentElement);
    }
    return c.split(' ');
  },
  createDashElement(e) {
    const { clientY } = e;
    const curSection = this.draggableElementsInfo.filter(n => n.calcSection(clientY));
    if (curSection.length === 0) {
      return;
    };
    this.dashElementRemove();
    const { x, y, w, h } = curSection[0];
    // 当前正在drag的项相对items的index
    const draggingEleIndex = getIn(this.draggableElementsInfo.filter(n => n.id === this.draggingFromThisWith), [0, 'index'], 'NONE');
    if (draggingEleIndex === 'NONE') {
      return;
    };
    const curElement = document.querySelectorAll(BASE_CLASS)[draggingEleIndex];
    const disparity = curElement.getBoundingClientRect().x - x;
    const offset = OFFSET.filter(n => n - disparity < 40).pop() || 0;
    console.log(offset);
    const dash = `<div class="${DASH_CLASS.substr(1)}" style="left: ${x + offset}px; top: ${y}px; height: ${h}px; width: ${w}px"></div>`;
    this.draggableElementsInfo[draggingEleIndex].offset = offset;
    $('body').append($(dash));
  },
  _getOffset_(disparity) {
    if (disparity < 40) {
      return 0;
    }
  },
  bindEvent() {
    this.chapterBoxRef.addEventListener('mousedown', this.onMousedown.bind(this), false);
    this.chapterBoxRef.addEventListener('mouseup', this.onMouseup.bind(this), false);
  },
  removeEvent() {
    this.chapterBoxRef.removeEventListener('mousemove', this.onMousemove);
    this.dashElementRemove();
  },
  dashElementRemove() {
    $(DASH_CLASS).remove();
  },
  onMousemove(e) {
    this.createDashElement(e);
  },
  onMousedown(e) {
    if (!this.draggableElementsInfo) {
      this.draggableElementsInfo = this.getElementPos();
    }
    if (!this.getTargetClassName(e.target).includes(BASE_CLASS.substring(1))) {
      return;
    }
    this.chapterBoxRef.addEventListener('mousemove', this.onMousemove, false);
  },
  onMouseup() {
    this.removeEvent();
  },
  onDragUpdate(result) {
    if (!result.destination) return;
    this.bindEvent();
  },
  onDragEnd(result) {
    if (!result.destination) return;
    const {
      source: { index: sourceIndex },
      destination: { index: destinationIndex }
    } = result;
    const items = this.items;
    const [removed] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, removed);
    this.removeEvent();
    // items新增offset,检测上面是否是folder，如果是folder，非folder加40
    // if (destinationIndex > 0) {
    //   const prev = items[destinationIndex - 1];
    //   const prevOffset = prev.offset || 0;
    //   const curOffset = this.draggableElementsInfo[destinationIndex].offset || 0;
    //   // const prevIsFolder = prev.folder;
    //   const curIsFolder = items[destinationIndex].folder;
    //   if (curOffset > prevOffset) {
    //     console.log('相对于上一个元素右移');
    //     // 相对于上一个元素右移
    //     prev.folder = true;
    //     items[destinationIndex].belong = prev.docId;
    //     // 当前移动元素偏移量为上一个元素偏移量+最小移动值
    //     items[destinationIndex].offset = prevOffset + OFFSET[0];
    //     if (curIsFolder) {
    //       items[destinationIndex].folder = false;
    //     }
    //   } else {
    //     console.log('相对于上一个元素左移或同级');
    //     // 相对于上一个元素左移或同级
    //     prev.folder = false;

    //     // items[destinationIndex].belong = prev.doc_id;
    //     // 当前移动项为folder或者是某个的下属，需同时移动下属项
    //     if (curIsFolder) {
    //       items[destinationIndex].folder = false;
    //       const sub = [];
    //       for (let i = destinationIndex; i < items.length; i++) {
    //         if (items[i].belong &&
    //           items[destinationIndex].offset !== curOffset &&
    //           (items[i].belong === items[destinationIndex].docId)) {
    //           sub.push(i);
    //         }
    //       }
    //       sub.forEach(n => {
    //         items[n].offset = curOffset;
    //       });
    //       console.log('sub:', sub);
    //     }
    //     // 判断是否还有同级元素
    //     const same = [];
    //     for (let i = destinationIndex + 1; i < items.length; i++) {
    //       if (items[i].belong &&
    //         items[destinationIndex].offset !== curOffset &&
    //         !curIsFolder &&
    //         (items[i].belong === items[destinationIndex].belong)) {
    //         same.push(i);
    //       }
    //     }
    //     if (same.length > 0) {
    //       // 下一个是否是
    //       console.log('same:', same);
    //       items[destinationIndex].folder = true;
    //       same.forEach(n => {
    //         items[n].belong = items[destinationIndex].doc_id;
    //       });
    //     }
    //     // 同级时belong为prev belong
    //     if (curOffset === prevOffset) {
    //       items[destinationIndex].belong = prev.belong;
    //     }
    //     items[destinationIndex].offset = curOffset;
    //   }
    // }
    // items.forEach((n, i) => {
    //   this.draggableElementsInfo[i].id = n.doc_id;
    //   this.draggableElementsInfo[i].folder = n.folder;
    // });
  }
};