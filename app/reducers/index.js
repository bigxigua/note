import { combineReducers } from 'redux';
import setUserInfo from './user.js';
import autoSaveMarkdown from './editor.js';

const rootReducer = combineReducers({
	setUserInfo,
	autoSaveMarkdown
});

export default rootReducer;