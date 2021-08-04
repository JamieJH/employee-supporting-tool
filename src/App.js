import './App.css';
import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Layout from './Components/UI/Layout/Layout';
import HomePage from './Pages/Home/Home';
import Logout from './Pages/Entry/Logout/Logout';
import Login from './Pages/Entry/Login/Login';
import AllEmployees from './Pages/Admin/AllEmployees/AllEmployees';
import AddUser from './Pages/Admin/UserTasks/AddUser/AddUser';
import EditUser from './Pages/Admin/UserTasks/EditUser/EditUser';
import ProtectedRoute from './Components/Navigation/ProtectedRoute';
import AbsenceRequests from './Pages/Admin/AbsenceRequests/AbsenceRequests';
import AddAbsenceRequest from './Pages/Admin/AbsenceTasks/AddAbsenceRequest/AddAbsenceRequest';

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
                                <ProtectedRoute path="/employees" exact component={AllEmployees} allowedRoles={["admin", "superadmin"]} />
                                <ProtectedRoute path="/add-user" exact component={AddUser} allowedRoles={["admin", "superadmin"]} />
                                <ProtectedRoute path="/absence-requests" exact component={AbsenceRequests} allowedRoles={["admin", "superadmin"]} />
                                <Route path="/new-request" exact component={AddAbsenceRequest} />
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
        isLoggedIn: state.auth.isLoggedIn
    }
}


export default connect(mapStateToProps, null)(withRouter(App));
