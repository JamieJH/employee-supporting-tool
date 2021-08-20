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
		title: "All Users",
		link: "/all-users",
		icon: "fa-users",
	}],
	superadmin: [{
		title: "Salary Payout",
		link: "/salary-payout",
		icon: "fa-money-check-alt",
	}, {
		title: "Salary Formula",
		link: "/salary-formula",
		icon: "fa-cogs",
	}],
}

const getPages = (role) => {
	if (role === 'superadmin') {
		return pages.employee.concat(pages.admin).concat(pages.superadmin);
	}
	else if (role === 'admin') {		
		return pages.employee.concat(pages.admin);
	}
	else {
		return pages.employee;
	}

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