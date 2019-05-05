export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const AUTO_SAVE_MARKDOWN_STATUS = 'AUTO_SAVE_MARKDOWN_STATUS';

// 自动保存markdown是否成功
export const autoSaveMarkdown = (status) => {
	return {
		type: AUTO_SAVE_MARKDOWN_STATUS,
		status
	}
};

//显示个人中心页面
export const updateUserInfo = (userInfo) => {
	return {
		type: UPDATE_USER_INFO,
		userInfo
	}
};