const BASE_CLASS = '.Chapter_Item';
const DASH_CLASS = '.Chapter_Item_Dash';
const OFFSET_MAP_LEVEL = {
  0: 0,
  40: 1,
  80: 2,
  120: 3
};
export default function ChapterLayout() {
  this.draggingFromThisWith = null;
  this.draggableElementsInfo = null;
  this.baselineX = 0;
}
ChapterLayout.prototype = {
  /**
  * @description 初始化
  * @param {Array}    items 目录结构json
  * @param {Function} setState useState,setState
  */
  init({ items, setState }) {
    this.chapterBoxRef = document;
    this.items = [].concat(items);
    this.onMousemove = this.onMousemove.bind(this);
    this.setState = setState;
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
  * @return {Num} result 结果
  */
  getDragElementPosition() {
    return Array.from(document.querySelectorAll(BASE_CLASS)).map((n) => {
      const { x, y, width, height } = n.getBoundingClientRect();
      const id = n.getAttribute('data-tbid');
      const classes = n.getAttribute('class').split(' ');
      const offset = parseInt(n.getAttribute('data-offset'));
      const m = 8;
      if (classes.includes(`${BASE_CLASS.substr(1)}_0`)) {
        this.baselineX = x;
      }
      return {
        x,
        y,
        id,
        w: width,
        h: height,
        offset: offset * 40,
        calcSection: (p) => {
          return p > y && p <= y + height + m;
        }
      };
    });
  },
  /**
  * @description 递归寻找目标元素class
  * @param {DOM} target dom元素
  * @return {Array} class 集合
  */
  getTargetClassName: function (target) {
    if (!target) {
      return [];
    }
    const c = target.getAttribute('class');
    if (!c || /^\s+$/.test(c)) {
      return this.getTargetClassName(target.parentElement);
    }
    return c.split(' ');
  },
  /**
  * @description 创建占位dash块
  * @param {Mouse Event} e
  */
  createDashElement(e) {
    if (!this.draggingFromThisWith) {
      return;
    }
    const { clientY } = e;
    const curSection = this.draggableElementsInfo.filter(n => n.calcSection(clientY));
    if (curSection.length === 0) {
      return;
    };
    this.dashElementRemove();
    const { x, y, w, h } = curSection[0];
    // draggingFromThisWith 表示是drag时id
    console.log('this.draggingFromThisWith', this.draggingFromThisWith);
    const index = this.draggableElementsInfo.findIndex(n => n.id === this.draggingFromThisWith);
    const curElement = document.querySelector(`${BASE_CLASS}_${this.draggingFromThisWith}`);
    const disparity = curElement.getBoundingClientRect().x - x;
    const offset = this.getOffset(disparity, x) + x;
    const dash = `<div class="${DASH_CLASS.substr(1)}" style="left: ${offset}px; top: ${y}px; height: ${h}px; width: ${w}px"></div>`;
    // const curItemsIndex = this.items.findIndex(n => n.docId === id);
    // console.log(this.items[curItemsIndex]);
    console.log('offset:', offset);
    this.draggableElementsInfo[index].offset = offset;
    $('body').append($(dash));
  },
  /**
  * @description 计算占位dash块的位置
  * @param {Number} 间距
  */
  getOffset(d, x) {
    const l = x + d;
    const b = this.baselineX;
    if (d < 0) {
      if (l >= b && l < b + 40) {
        return b - x;
      } else if (l >= b + 40 && l < b + 80) {
        return b + 40 - x;
      } else if (l >= b + 80 && l < b + 120) {
        return b + 80 - x;
      } else {
        return b - x;
      }
    } else if (d < 40) {
      return 0;
    } else if (d < 80) {
      return 40;
    } else if (d < 120) {
      return 80;
    } else {
      return 120;
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
      this.draggableElementsInfo = this.getDragElementPosition();
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
    console.log('onDragUpdate');
  },
  onDragEnd(result) {
    this.removeEvent();
    if (!result.destination) return;
    const {
      source: { index: sourceIndex }, // 当前drag元素位置
      destination: { index: destinationIndex } // 被放下位置
    } = result;
    let items = this.items;
    const draggableElementsInfo = this.draggableElementsInfo;
    if (sourceIndex === destinationIndex && destinationIndex === 0) {
      return;
    }
    const {
      offset // drag元素的offset
    } = this.draggableElementsInfo[destinationIndex];
    // offset匹配level，且相邻项level相差不得大于1
    const level = OFFSET_MAP_LEVEL[Math.abs(offset - this.baselineX)];
    const { level: prevLevel } = items[destinationIndex - 1];
    const { level: destinationLevel } = items[destinationIndex];
    const { level: sourceLevel } = items[sourceIndex];

    if (sourceIndex !== destinationIndex && destinationLevel !== sourceLevel) {
      // 只有level相同的才可以互换
      return;
    }
    if (sourceIndex === destinationIndex) {
      console.log({
        prevLevel,
        destinationLevel,
        sourceLevel,
        level,
        'offset - this.baselineX': offset - this.baselineX,
        offset,
        'this.baselineX': this.baselineX,
        items
      });
      if (destinationLevel < level) {
        console.log('相对右移');
        items[destinationIndex].level = Math.min(prevLevel + 1, level);
      } else if (destinationLevel === level) {
        console.log('平行位置');
        items[destinationIndex].level = destinationLevel;
      } else {
        console.log('相对左移');
        items[destinationIndex].level = level;
        const subs = this.getSubs(destinationIndex, destinationLevel);
        if (subs.length > 0) {
          subs.forEach(p => {
            items[items.findIndex(n => n.docId === p.docId)].level--;
          });
        }
      }
    } else {
      const sourceSub = this.getSubs(sourceIndex, sourceLevel);
      const destinationSub = this.getSubs(destinationIndex, destinationLevel);
      const [removed] = items.splice(sourceIndex, 1);
      const [removed2] = draggableElementsInfo.splice(sourceIndex, 1);
      items.splice(destinationIndex, 0, removed);
      draggableElementsInfo.splice(destinationIndex, 0, removed2);
      if (sourceSub.length > 0) {
        items = this.exchangeSubItemsOrder(sourceSub, destinationIndex, [].concat(items));
      }
      if (destinationSub.length > 0) {
        items = this.exchangeSubItemsOrder(destinationSub, sourceIndex, items);
      }
    }
    this.items = items;
    this.setState({ items });
    this.syncDraggableElementsInfo();
  },
  getSubs(index, level) {
    const subs = [];
    for (let i = index + 1; i < this.items.length; i++) {
      const n = this.items[i];
      if (n.level <= level) {
        break;
      }
      subs.push(n);
    };
    return subs;
  },
  exchangeSubItemsOrder(subs, index, arr) {
    const items = arr.slice(0);
    subs.forEach(p => {
      const l = arr.findIndex(n => n.docId === p.docId);
      l !== -1 && items.splice(l, 1, null);
    });
    items.splice(Math.min(index + 1, items.length), 0, ...subs);
    return items.filter(n => !!n);
  },
  syncDraggableElementsInfo(items = this.items) {
    const result = [];
    items.forEach((n, i) => {
      result.push({
        ...this.draggableElementsInfo[i],
        id: n.docId
      });
    });
    this.draggableElementsInfo = result;
  }
};