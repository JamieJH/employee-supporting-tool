import * as actionTypes from './actionTypes';

export const login = (userData) => {
    return {
        type: actionTypes.LOGIN,
        payload: {userData}
    }
}

export const logout = () => {
    return {
        type: actionTypes.LOGOUT,
    }
}