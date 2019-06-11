import { connect } from 'react-redux'
import Index from './Index.jsx'

import { 
  setUserInfoToStore,
  setSaveStatusToStore,
  setCurrentEditSubnoteInfoToStore,
  setNotesInfoToStore,
  setEditorToStore,
  setDrawerVisibleToStore,
} from '../../actions/index.js'

function mapStateToProps(state) {
	return {
		userInfo: state.userReducer.userInfo,
		saveStatus: state.editorReducer.saveStatus,
		markdownInfo: state.editorReducer.markdownInfo,
		editorInstance: state.editorReducer.editorInstance,
		canShowDrawer: state.editorReducer.canShowDrawer,
		notes: state.editorReducer.notes,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setUserInfoToStore: (index) => {dispatch(setUserInfoToStore(index))},
		setNotesInfoToStore: (notes) => {dispatch(setNotesInfoToStore(notes))},
		setEditorToStore: (editor) => {dispatch(setEditorToStore(editor))},
		setDrawerVisibleToStore: (editor) => {dispatch(setDrawerVisibleToStore(editor))},
		setCurrentEditSubnoteInfoToStore: (markdown) => {dispatch(setCurrentEditSubnoteInfoToStore(markdown))},
		setSaveStatusToStore: (status) => {
			dispatch(setSaveStatusToStore(status));
		}
	}
} 

export default connect(mapStateToProps, mapDispatchToProps)(Index)