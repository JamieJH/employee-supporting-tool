import React, { useEffect, Suspense } from 'react';
import { Switch, Route, withRouter, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from './Components/index';
import { ProtectedRoute, SharedRoute } from './Components/Routes/RouteTypes';
import {
	HomePage, Login, AllUsers, AddUser, EditUser,
	AbsenceRequestsAdmin, AbsenceRequestsEmployee, AddAbsenceRequestAdmin,
	AddAbsenceRequestEmployee, EditAbsenceRequest, AllOTLogsAdmin,
	AllOTLogsEmployee, LogOTAdmin, LogOTEmployee, EditOTLog
} from './Pages/index';
import Modal from './Components/Modal/Modal';
import Spinner from './Components/Spinner/Spinner';

import { closeModal, hideSpinner } from './redux/actions/modalSpinnerActions';

const App = () => {
	const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
	const history = useHistory();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(hideSpinner());
		dispatch(closeModal());
		if (!isLoggedIn) {
			history.replace('/login');
		}
	}, [dispatch, history, isLoggedIn ])


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
						</Suspense>
					</Layout>
				</Switch>}

			<Modal />
			<Spinner />

		</div>
	);

}


export default withRouter(App);
