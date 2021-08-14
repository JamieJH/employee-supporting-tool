import * as actionTypes from '../actions/actionTypes';
import { updateState } from '../utils';


const initState = {
  isModalOpen: false,
  isSpinnerOpen: false,
  modalDetails: {
    type: '',
    title: '',
    content: ''
  }
}


const ModalSpinnerReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.OPEN_MODAL:
      const modalDetails = action.payload.modalDetails;
      console.log(modalDetails);

      return updateState({
        isModalOpen: true,
        isSpinnerOpen: false,
        modalDetails: {
          ...modalDetails
        }
      })

    case actionTypes.CLOSE_MODAL:
      return { ...initState };

    case actionTypes.SHOW_SPINNER:
      return updateState(state, {
        isSpinnerOpen: true
      })

    case actionTypes.HIDE_SPINNER:
      return updateState(state, {
        isSpinnerOpen: false
      })

    default:
      return state;
  }
}

export default ModalSpinnerReducer;