import * as actionTypes from './actionTypes';

export const openModal = (modalDetails) => {
    return {
        type: actionTypes.OPEN_MODAL,
        payload: {modalDetails: modalDetails}
    }
}

export const closeModal = () => {
    return {
        type: actionTypes.CLOSE_MODAL,
    }
}

export const showSpinner = () => {
    return {
        type: actionTypes.SHOW_SPINNER
    }
}

export const hideSpinner = () => {
    return {
        type: actionTypes.HIDE_SPINNER,
    }
}