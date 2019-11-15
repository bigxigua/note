export default (state, action) => {
  switch (action.type) {
    case 'UPDATE_USER_INFO':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};