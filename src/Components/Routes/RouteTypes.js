import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { useSelector } from 'react-redux';

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

	const { employeeComponent: ComponentEmployee, adminComponent: ComponentAdmin, ...args } = props;
	return (
		<Route {...args} exact render={props => {
			return (loggedInRole === 'employee')
				? <ComponentEmployee {...props} />
				: <ComponentAdmin {...props} />
		}} />
	);

}
