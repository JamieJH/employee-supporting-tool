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

export const addTeamMember = (memberId) => {
    return {
        type: actionTypes.ADD_TEAM_MEMBER,
        payload: {memberId}
    }
}

export const removeTeamMember = (memberId) => {
    return {
        type: actionTypes.REMOVE_TEAM_MEMBER,
        payload: {memberId}
    }
}