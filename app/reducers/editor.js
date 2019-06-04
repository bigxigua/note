let defaultState = {
	saveStatus: 'initial',
	markdownInfo: {}, // 正在编辑的子笔记信息
	notes: [], // 用户所有的笔记本（笔记本下有子笔记）
	wastepaperBaskets: [], // 废纸篓
};

export default function editorReducer(state = defaultState, action) {
	switch(action.type) {
        case 'AUTO_SAVE_MARKDOWN_STATUS': {
            return Object.assign({}, state, {saveStatus: action.status});
		}
		case 'SET_INIT_MRKDOWN_CONTENT': {
            return Object.assign({}, state, {markdownInfo: action.markdownInfo});
		}
		case 'UPDATE_USER_NOTES': {
            return Object.assign({}, state, {notes: action.notes});
        }
		default: {
			return state
		}
	}
}