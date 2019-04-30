export const CURRENT_PAGE = 'INDEX';

//显示个人中心页面
export const updateUserInfo = (page) => {
	return {
		type: CURRENT_PAGE,
		page
	}
};