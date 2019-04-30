import { connect } from 'react-redux'
import Index from './Index.jsx'

import { 
  updateUserInfo
} from '../../actions/index.js'

function mapStateToProps(state) {
	return {
		userInfo: state.setUserInfo.userInfo
	}
}

function mapDispatchToProps(dispatch) {
	return {
		updateUserInfo: (index) => {dispatch(updateUserInfo(index))},
	}
} 

export default connect(mapStateToProps, mapDispatchToProps)(Index)