import { connect } from 'react-redux'
import Index from './Index.jsx'

import { 
  updateUserInfo,
  autoSaveMarkdown,
  setInitMarkdownContent,
  updateUserNotes,
  setEditorToStore,
} from '../../actions/index.js'

function mapStateToProps(state) {
	return {
		userInfo: state.userReducer.userInfo,
		saveStatus: state.editorReducer.saveStatus,
		markdownInfo: state.editorReducer.markdownInfo,
		editorInstance: state.editorReducer.editorInstance,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		updateUserInfo: (index) => {dispatch(updateUserInfo(index))},
		updateUserNotes: (notes) => {dispatch(updateUserNotes(notes))},
		setEditorToStore: (editor) => {dispatch(setEditorToStore(editor))},
		setInitMarkdownContent: (markdown) => {dispatch(setInitMarkdownContent(markdown))},
		autoSaveMarkdown: (status) => {
			dispatch(autoSaveMarkdown(status));
		}
	}
} 

export default connect(mapStateToProps, mapDispatchToProps)(Index)