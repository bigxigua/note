export default (state, action) => {
  switch (action.type) {
    case 'UPDATE_EDITRO_INFO':
      return {
        ...state,
        editor: action.payload
      };
    default:
      return state;
  }
};