let defaultState = {
	userInfo: {
	}
};

export default function pageState(state = defaultState, action) {
	switch(action.type) {
		case 'UPDATE_USER_INFO': {
            return Object.assign({}, state, {userInfo: action.userInfo});
        }
		default: {
			return state
		}
	}
}