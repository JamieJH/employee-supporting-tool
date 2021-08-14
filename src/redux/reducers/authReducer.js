import * as actionTypes from '../actions/actionTypes';
import { updateState } from '../utils';


const pages = {
    employee: [{
        title: "Calendar",
        link: "/calendar",
        icon: "fa-calendar-alt",
    }, {
        title: "salary",
        link: "/salary",
        icon: "fa-money-check-alt",
    }, {
        title: "Absence Requests",
        link: "/absence-requests",
        icon: "fa-calendar-minus",
    }, {
        title: "OT Logs",
        link: "/ot-logs",
        icon: "fa-business-time",
    }],
    admin: [{
        title: "All Employees",
        link: "/employees",
        icon: "fa-users",
    }, {
        title: "Absence Requests",
        link: "/absence-requests",
        icon: "fa-calendar-minus",
    }, {
        title: "OT Logs",
        link: "/ot-logs",
        icon: "fa-business-time",
    }],
    superadmin: [{
        title: "Change Settings",
        link: "/change-settings",
        icon: "fa-cogs",
    }],
}

const getPages = (role) => {
    if (role === 'superadmin') {
        return pages.admin.concat(pages.superadmin);
    }

    return pages[role];
}


const initState = {
    isLoggedIn: false,
    userId: null,
    role: null,
    userDetails: null,
    pages: null,
}


const AuthReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN:
            const userData = action.payload.userData;
            const pages = getPages(userData.role);

            console.log(userData.details);

            return updateState(state, {
                isLoggedIn: true,
                userId: userData.id,
                role: userData.role,
                userDetails: userData.details,
                pages: pages
            })

        case actionTypes.LOGOUT:
            return updateState(state, { ...initState });

        default:
            return state;
    }
}

export default AuthReducer;