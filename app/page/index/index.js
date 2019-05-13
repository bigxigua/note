import { connect } from 'react-redux'
import Index from './Index.jsx'

import { 
  updateUserInfo,
  autoSaveMarkdown,
  setInitMarkdownContent
} from '../../actions/index.js'

function mapStateToProps(state) {
	return {
		userInfo: state.userReducer.userInfo,
		saveStatus: state.editorReducer.saveStatus,
		markdownInfo: state.editorReducer.markdownInfo
	}
}

function mapDispatchToProps(dispatch) {
	return {
		updateUserInfo: (index) => {dispatch(updateUserInfo(index))},
		setInitMarkdownContent: (markdown) => {dispatch(setInitMarkdownContent(markdown))},
		autoSaveMarkdown: (status) => {
			dispatch(autoSaveMarkdown(status));
		}
	}
} 

export default connect(mapStateToProps, mapDispatchToProps)(Index)