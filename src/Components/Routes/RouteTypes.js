import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

export const ProtectedRoute = (props) => {
	const loggedInRole = useSelector(state => state.auth.role);

	const { component: Component, allowedRoles, ...args } = props;
	return (
		<Route {...args} exact render={props => {
			return (allowedRoles.includes(loggedInRole))
				? <Component {...props} />
				: <Redirect to={{ pathname: '/', state: { from: props.location } }} />
		}} />
	);

}

export const SharedRoute = (props) => {
	const loggedInRole = useSelector(state => state.auth.role);
	
	const {
		employeeComponent: ComponentEmployee,
		adminComponent: ComponentAdmin,
		superAdminComponent: ComponentSuperAdmin,
		...args 
	} = props;

	const getComponentFromRole = (props) => {
		const configurations = {
			'employee': () => {
				return ComponentEmployee;
			},
			'admin': () => {
				return ComponentAdmin;
			},
			'superadmin': () => {
				return ComponentSuperAdmin || ComponentAdmin;
			}
		}

		const RoleComponent = configurations[loggedInRole]();		
		return <RoleComponent {...props} />
	}


	return (
		<Route {...args} exact render={props => {
			return getComponentFromRole(props);
		}} />
	);

}

ProtectedRoute.propTypes = {
	component: PropTypes.elementType.isRequired,
	allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

SharedRoute.propTypes = {
	employeeComponent: PropTypes.elementType.isRequired,
	adminComponent: PropTypes.elementType.isRequired,
};