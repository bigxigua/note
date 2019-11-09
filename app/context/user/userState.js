import React, { useReducer } from 'react';
import userContext from './userContext';
import userReducer from './userReducer';

const UserState = props => {
  const initialState = {
    avatar: 'https://pic4.zhimg.com/v2-a026c6cf35d9c35765d6af1f9101b74e.jpeg',
    nickname: 'bigxigua',
    intro: '帅'
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
