export default (state, action) => {
  switch (action.type) {
    case 'UPDATE_USER_INFO':
      return {
        ...state,
        userInfo: action.payload
      };
    default:
      return state;
  }
};