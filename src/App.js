import './App.css';
import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Layout from './Components/UI/Layout/Layout';
import { ProtectedRoute, SharedRoute } from './Components/Routes/RouteTypes';
import { 
    HomePage, Login, Logout, AllUsers, AddUser, EditUser,
    AbsenceRequestsAdmin, AbsenceRequestsEmployee, AddAbsenceRequestAdmin,
    AddAbsenceRequestEmployee, EditAbsenceRequest, AllOTLogsAdmin,
    AllOTLogsEmployee, LogOTAdmin, LogOTEmployee, EditOTLog
} from './Components/Routes/RoutesComponents';

class App extends Component {

    componentDidMount() {
        if (!this.props.isLoggedIn) {
            this.props.history.replace('/login');
        }
    }

    render() {
        return (
            <div className="App">
                {(!this.props.isLoggedIn) ? <Login /> :
                    <Switch>
                        <Route path="/login" exact component={Login} />
                        <Route path="/logout" exact component={Logout} />
                        <Layout>
                            <Switch>
                                <ProtectedRoute path="/employee/:userId" exact
                                    allowedRoles={["admin", "superadmin"]}
                                    component={EditUser}
                                />
                                <ProtectedRoute path="/employees" exact component={AllUsers} allowedRoles={["admin", "superadmin"]} />
                                <ProtectedRoute path="/add-user" exact component={AddUser} allowedRoles={["admin", "superadmin"]} />
                                <ProtectedRoute path="/edit-request/:requestId" exact
                                    component={EditAbsenceRequest}
                                    allowedRoles={["admin", "superadmin"]} />

                                <ProtectedRoute path="/edit-ot/:logId" exact
                                    component={EditOTLog}
                                    allowedRoles={["admin", "superadmin"]} />

                                <SharedRoute path='/absence-requests' exact employeeComponent={AbsenceRequestsEmployee} adminComponent={AbsenceRequestsAdmin} />
                                <SharedRoute path='/new-request' exact employeeComponent={AddAbsenceRequestEmployee} adminComponent={AddAbsenceRequestAdmin} />

                                <SharedRoute path='/ot-logs' exact employeeComponent={AllOTLogsEmployee} adminComponent={AllOTLogsAdmin} />
                                <SharedRoute path='/log-ot' exact employeeComponent={LogOTEmployee} adminComponent={LogOTAdmin} />

                                <Route path="/" component={() => <HomePage />} />
                            </Switch>
                        </Layout>
                    </Switch>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        role: state.auth.role,
    }
}


export default connect(mapStateToProps, null)(withRouter(App));
