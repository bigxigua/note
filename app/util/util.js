
export function throttle(fn, wait = 2000, immediately = false) {
  let latestTime = Date.now();
  let _immediately_ = immediately;
  return function () {
    if (!_immediately_) {
      fn.apply(this, arguments);
      _immediately_ = true;
    } else {
      const curTime = Date.now();
      if (curTime >= latestTime + wait) {
        fn.apply(this, arguments);
        latestTime = curTime;
      }
    }
  };
};
export function debunce(fn, wait = 2000, immediately = false) {
  let timer = null;
  let	_immediately_ = immediately;
  return function() {
    if (_immediately_) {
      fn.apply(this, arguments);
      _immediately_ = false;
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, wait);
    }
  };
}
export function isEmptyObject(param) {
  if (!param || typeof param !== 'object') {
    return false;
  }
  return Object.keys(param).length === 0;
}
export function formatTimeStamp(timestamp) {
  if (!timestamp) {
    return '-';
  }
  const date = new Date(+timestamp);
  const completionZero = function(number) {
    return `${number >= 9 ? '' : '0'}${number}`;
  };
  return `${date.getFullYear()}-` +
           `${completionZero(date.getMonth() + 1)}-` +
           `${completionZero(date.getDate())}` +
           `  ${completionZero(date.getHours())}:` +
           `${completionZero(date.getMinutes())}:` +
           `${completionZero(date.getSeconds())}`;
}
export function findCurrentNoteBookAndSubNoteFromNotes(notes, notebookId, subNoteId) {
  if (!Array.isArray(notes)) {
    return [{}, {}];
  }
  let notebook = {};
  let subnote = {};
  const curNoteIndex = notes.findIndex(n => n.notebook_id === notebookId);
  let curSubNoteIndex = -1;
  if (curNoteIndex !== -1) {
    notebook = notes[curNoteIndex];
    if (subNoteId) {
      curSubNoteIndex = notebook.subNotes.findIndex(n => n.sub_note_id === subNoteId);
      if (curSubNoteIndex !== -1) {
        subnote = notebook.subNotes[curSubNoteIndex];
      }
    }
  }
  return [{ notebook, curNoteIndex }, { subnote, curSubNoteIndex }];
}

export function getIn(data, array, initial = null) {
  let obj = Object.assign({}, data);
  for (let i = 0; i < array.length; i++) {
    if (typeof obj !== 'object' || obj === null) {
      return initial;
    }
    const prop = array[i];
    obj = obj[prop];
  }
  if (obj === undefined || obj === null) {
    return initial;
  }
  return obj;
};