import React, { useReducer } from 'react';
import userContext from './userContext';
import userReducer from './userReducer';

const UserState = props => {
  const initialState = {
    avatar: '/images/pikachu.svg',
    nickname: ''
  };
  const [state, dispatch] = useReducer(userReducer, initialState);
  // 更新用户信息
  const updateUserInfo = (payload) => {
    dispatch({
      type: 'UPDATE_USER_INFO',
      payload
    });
  };
  return (
    <userContext.Provider
      value={{
        userInfo: state,
        updateUserInfo
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

export default UserState;
