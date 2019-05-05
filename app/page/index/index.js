import { connect } from 'react-redux'
import Index from './Index.jsx'

import { 
  updateUserInfo,
  autoSaveMarkdown
} from '../../actions/index.js'

function mapStateToProps(state) {
	return {
		userInfo: state.setUserInfo.userInfo,
		saveStatus: state.autoSaveMarkdown.saveStatus,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		updateUserInfo: (index) => {dispatch(updateUserInfo(index))},
		autoSaveMarkdown: (status) => {
			dispatch(autoSaveMarkdown(status));
		}
	}
} 

export default connect(mapStateToProps, mapDispatchToProps)(Index)