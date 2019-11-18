import React, { useReducer } from 'react';
import editorContext from './editorContext';
import editorReducer from './editorReducer';

const UserState = props => {
  const initialState = {
    editor: null
  };
  const [state, dispatch] = useReducer(editorReducer, initialState);
  // 更新用户信息
  const updateEditorInfo = (payload) => {
    dispatch({
      type: 'UPDATE_EDITRO_INFO',
      payload
    });
  };
  return (
    <editorContext.Provider
      value={{
        ...state,
        updateEditorInfo
      }}
    >
      {props.children}
    </editorContext.Provider>
  );
};

export default UserState;
