let defaultState = {
	saveStatus: 'initial',
	markdownInfo: {}
};

export default function editorReducer(state = defaultState, action) {
	switch(action.type) {
        case 'AUTO_SAVE_MARKDOWN_STATUS': {
            return Object.assign({}, state, {saveStatus: action.status});
		}
		case 'SET_INIT_MRKDOWN_CONTENT': {
            return Object.assign({}, state, {markdownInfo: action.markdownInfo});
        }
		default: {
			return state
		}
	}
}