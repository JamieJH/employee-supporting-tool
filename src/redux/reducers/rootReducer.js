// import AuthReducer from './authReducer';
// import ModalSpinnerReducer from './';
import AuthReducer from './authReducer';
import ModalSpinnerReducer from './modalSpinnerReducer';
import {combineReducers} from 'redux'

export default combineReducers({
    auth: AuthReducer,
    modalSpinner: ModalSpinnerReducer
})
