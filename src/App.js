import './App.css';
import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Layout from './Components/UI/Layout/Layout';
import HomePage from './Pages/Home/Home';
import Logout from './Pages/Entry/Logout/Logout';
import Login from './Pages/Entry/Login/Login';
import AllUsers from './Pages/Admin/UserTasks/AllUsers/AllUsers';
import AddUser from './Pages/Admin/UserTasks/AddUser/AddUser';
import EditUser from './Pages/Admin/UserTasks/EditUser/EditUser';
import ProtectedRoute from './Components/Navigation/ProtectedRoute';
import AbsenceRequests from './Pages/Admin/AbsenceTasks/AbsenceRequests/AbsenceRequests';
import EditAbsenceReqeust from './Pages/Admin/AbsenceTasks/EditAbsenceRequest/EditAbsenceRequest';
import AbsenceRequestsEmployee from './Pages/Employee/AbsenceTasks/AbsenceRequestsEmployee/AbsenceRequestsEmployee';
import AddAbsenceRequestAdmin from './Pages/Admin/AbsenceTasks/AddAbsenceRequest/AddAbsenceRequest';
import AddAbsenceRequestEmployee from './Pages/Employee/AbsenceTasks/AddAbsenceRequestEmployee/AddAbsenceRequestEmployee';

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
                                <ProtectedRoute path="/absence-requests" exact component={AbsenceRequests} allowedRoles={["admin", "superadmin"]} />
                                <ProtectedRoute path="/new-request" exact component={AddAbsenceRequestAdmin} allowedRoles={["admin", "superadmin"]}/>
                                <ProtectedRoute path="/edit-request/:requestId" exact
                                    component={EditAbsenceReqeust}
                                    allowedRoles={["admin", "superadmin"]} />

                                <ProtectedRoute path="/absence-requests-employee" exact component={AbsenceRequestsEmployee} allowedRoles={["employee"]} />
                                <ProtectedRoute path="/new-request-employee" exact component={AddAbsenceRequestEmployee} allowedRoles={["employee"]}/>
                                
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
