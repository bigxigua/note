export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const AUTO_SAVE_MARKDOWN_STATUS = 'AUTO_SAVE_MARKDOWN_STATUS';
export const SET_INIT_MRKDOWN_CONTENT = 'SET_INIT_MRKDOWN_CONTENT';
export const UPDATE_USER_NOTES = 'UPDATE_USER_NOTES';
export const SET_EDITOR_INSTANCE = 'SET_EDITOR_INSTANCE';

// 自动保存markdown是否成功
export const autoSaveMarkdown = (status) => {
	return {
		type: AUTO_SAVE_MARKDOWN_STATUS,
		status
	}
};
// 获取正在编辑的markdonw文本
export const setInitMarkdownContent = (markdownInfo) => {
	return {
		type: SET_INIT_MRKDOWN_CONTENT,
		markdownInfo
	}
};
// 更新用户笔记本信息
export const updateUserNotes = (notes) => {
	return {
		type: UPDATE_USER_NOTES,
		notes
	}
};
//显示个人中心页面
export const updateUserInfo = (userInfo) => {
	return {
		type: UPDATE_USER_INFO,
		userInfo
	}
};

// 将编辑器对象保存到store
export const setEditorToStore = (editorInstance) => {
	return {
		type: SET_EDITOR_INSTANCE,
		editorInstance
	}
}