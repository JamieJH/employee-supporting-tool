import React, { useEffect, Suspense } from 'react';
import { Switch, Route, withRouter, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from './Components/index';
import { ProtectedRoute, SharedRoute } from './Components/Routes/RouteTypes';
import {
	Login, AllUsers, AddUser, EditUser,
	AbsenceRequestsAdmin, AbsenceRequestsEmployee, AddAbsenceRequestAdmin,
	AddAbsenceRequestEmployee, EditAbsenceRequest, AllOTLogsAdmin,
	AllOTLogsEmployee, LogOTAdmin, LogOTEmployee, EditOTLog,
	SalaryFormula, SalaryPayout, SalaryProgress, WorkCalendar
} from './Pages/index';
import { Modal, Spinner } from './Components';

const App = () => {
	const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
	const history = useHistory();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!isLoggedIn) {
			history.replace('/login');
		}
	}, [dispatch, history, isLoggedIn])


	return (
		<div className="App">
			{(!isLoggedIn) ? <Login /> :
				<Switch>
					<Route path="/login" exact component={Login} />
					<Layout>
						<Suspense fallback={<Spinner />}>
							<Switch>
								<ProtectedRoute path="/employee/:userId" exact
									allowedRoles={["admin", "superadmin"]}
									component={EditUser}
								/>
								<ProtectedRoute path="/all-users" exact component={AllUsers} allowedRoles={["admin", "superadmin"]} />
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

								<ProtectedRoute path="/salary-formula" exact
									component={SalaryFormula}
									allowedRoles={["superadmin"]} />
								<ProtectedRoute path="/salary-payout" exact
									component={SalaryPayout}
									allowedRoles={["superadmin"]} />

								<Route path="/salary" exact component={SalaryProgress} />
								<Route path='/calendar' component={WorkCalendar} />
								<Route path='/' exact component={WorkCalendar} />

							</Switch>
						</Suspense>
					</Layout>
				</Switch>}

			<Modal />
			<Spinner />

		</div>
	);

}


export default withRouter(App);
