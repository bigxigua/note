export default (state, action) => {
  switch (action.type) {
    case 'UPDATE_CURRENT_DOC_INFO':
      return {
        ...state,
        currentDocInfo: action.payload
      };
    case 'UPDATE_DOCS':
      return {
        ...state,
        docs: action.payload
      };
    case 'UPDATE_SPACE':
      return {
        ...state,
        space: action.payload
      };
    default:
      return state;
  }
};