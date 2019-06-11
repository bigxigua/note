let defaultState = {
	saveStatus: 'initial', // 保存编辑内容的状态
	markdownInfo: {}, // 正在编辑的子笔记信息
	notes: [], // 用户所有的笔记本（笔记本下有子笔记）
	wastepaperBaskets: [], // 废纸篓
	editorInstance: null, // 编辑器对象
	canShowDrawer: false, // 是否显示左边侧边栏
};

export default function editorReducer(state = defaultState, action) {
	switch (action.type) {
		case 'AUTO_SAVE_MARKDOWN_STATUS': {
			return Object.assign({}, state, { saveStatus: action.status });
		}
		case 'SET_INIT_MRKDOWN_CONTENT': {
			return Object.assign({}, state, { markdownInfo: action.markdownInfo });
		}
		case 'UPDATE_USER_NOTES': {
			return Object.assign({}, state, { notes: action.notes });
		}
		case 'SET_EDITOR_INSTANCE': {
			return Object.assign({}, state, { editorInstance: action.editorInstance });
		}
		case 'CHANGE_DRADER_VISIBLE': {
			return Object.assign({}, state, { canShowDrawer: action.show });
		}
		default: {
			return state
		}
	}
}