let defaultState = {
	saveStatus: 'initial'
};

export default function autoSaveMarkdown(state = defaultState, action) {
	switch(action.type) {
        case 'AUTO_SAVE_MARKDOWN_STATUS': {
            return Object.assign({}, state, {saveStatus: action.status});
        }
		default: {
			return state
		}
	}
}