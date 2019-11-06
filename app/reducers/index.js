import { combineReducers } from 'redux';
import userReducer from './user.js';
import editorReducer from './editor.js';

const rootReducer = combineReducers({
  userReducer,
  editorReducer
});

export default rootReducer;