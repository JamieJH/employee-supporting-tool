import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

class ProtectedRouteComponent extends Component {
    render() {
        const { component: Component, loggedInRole, allowedRoles, ...args } = this.props;
        return (
            <Route {...args} exact render={props => {
                return (allowedRoles.includes(loggedInRole))
                    ? <Component {...props} />
                    : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            }} />
        );
    }
}

class SharedRouteComponent extends Component {
    render() {
        const { employeeComponent: ComponentEmployee, adminComponent: ComponentAdmin, ...args } = this.props;
        return (
            <Route {...args} exact render={props => {
                return (this.props.loggedInRole === 'employee')
                    ? <ComponentEmployee {...props} />
                    : <ComponentAdmin {...props} />
            }} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loggedInRole: state.auth.role
    }
}

export const ProtectedRoute = connect(mapStateToProps, null)(ProtectedRouteComponent);
export const SharedRoute = connect(mapStateToProps, null)(SharedRouteComponent);