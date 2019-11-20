import React, { useReducer } from 'react';
import editorContext from './editorContext';
import editorReducer from './editorReducer';

const UserState = props => {
  const initialState = {
    editor: null,
    saveContentStatus: -1 // 保存文档内容状态 -1无状态 0正在保存 1保存成功 2保存失败
  };
  const [state, dispatch] = useReducer(editorReducer, initialState);
  // 更新用户信息
  const updateEditorInfo = (payload) => {
    dispatch({
      type: 'UPDATE_EDITRO_INFO',
      payload
    });
  };
  // 更新文档内容保存状态
  const updateSaveStatus = (payload) => {
    dispatch({
      type: 'UPDATE_SAVE_STATUS',
      payload
    });
  };
  return (
    <editorContext.Provider
      value={{
        ...state,
        updateEditorInfo,
        updateSaveStatus
      }}
    >
      {props.children}
    </editorContext.Provider>
  );
};

export default UserState;
