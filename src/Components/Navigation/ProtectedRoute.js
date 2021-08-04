import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

class ProtectedRoute extends Component {
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

const mapStateToProps = (state) => {
    return {
        loggedInRole: state.auth.role
    }
}

export default connect(mapStateToProps, null)(ProtectedRoute);