export default (state, action) => {
  switch (action.type) {
    case 'UPDATE_EDITRO_INFO':
      return {
        ...state,
        editor: action.payload
      };
    case 'UPDATE_SAVE_STATUS':
      return {
        ...state,
        saveContentStatus: action.payload
      };
    default:
      return state;
  }
};