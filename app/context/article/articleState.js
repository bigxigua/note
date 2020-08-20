import React, { useReducer } from 'react';
import articleContext from './articleContext';
import articleReducer from './articleReducer';

const State = props => {
  const initialState = {
    currentDocInfo: {}, // 当前文档信息
    docs: [], // 和当前文档属于同一个空间的文档列表
    space: {}, // 当前文档所属空间信息
  };
  const [state, dispatch] = useReducer(articleReducer, initialState);

  // 更新当前文档信息
  const updateStoreCurrentDoc = (payload) => {
    dispatch({
      type: 'UPDATE_CURRENT_DOC_INFO',
      payload
    });
  };

  // 更新docs
  const updateStoreDocs = (payload) => {
    dispatch({
      type: 'UPDATE_DOCS',
      payload
    });
  };

  // 更新space
  const updateStoreSpace = (payload) => {
    dispatch({
      type: 'UPDATE_SPACE',
      payload
    });
  };

  return (
    <articleContext.Provider
      value={{
        ...state,
        updateStoreCurrentDoc,
        updateStoreDocs,
        updateStoreSpace
      }}
    >
      {props.children}
    </articleContext.Provider>
  );
};

export default State;
