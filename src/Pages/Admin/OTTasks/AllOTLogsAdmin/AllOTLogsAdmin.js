import React, { useState, useEffect } from 'react';
import { MainContentLayout, AddDataButton } from '../../../../Components';
import { useDispatch, useSelector } from 'react-redux';
import { showSpinner } from '../../../../redux/actions/modalSpinnerActions';
import OneOTLogAdmin from './OneOTLogAdmin';
import CustomTablePaginate from '../../../../Containers/CustomTablePaginate/CustomTablePaginate';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './AllOTLogsAdmin.module.css';

const AllOTLogsAdmin = () => {
	const [logs, setLogs] = useState(null);
	const teamMembers = useSelector(state => state.auth.teamMembers);
	const role = useSelector(state => state.auth.role);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(showSpinner());
		firebase.database().ref('/ot-logs')
			.once('value')
			.then(snapshot => {
				return snapshot.val();
			})
			.then(data => {
				const logs = [];
				// if logged in user is admin then only get details of their team members, get all if superadmin
				for (const [id, details] of Object.entries(data)) {
					if (role === 'admin' && !teamMembers[details.employeeId]) {
						continue;
					}
					details.id = id;
					logs.push(details);
				}

				setLogs(logs);
			})
	}, [dispatch, role, teamMembers])


	return (logs) && (
		<MainContentLayout
			title="OT Logs"
			description="Review, process, and edit OT logs.">
			<AddDataButton title="Log OT" path="/log-ot" />
			<CustomTablePaginate items={logs} oneItemComponent={OneOTLogAdmin} maxCol={6}>
				<th className={styles.employee}>Employee</th>
				<th className={styles.dateTime}>Date & Time Started</th>
				<th className={styles.duration}>Duration (hours)</th>
				<th className={styles.workSummary}>Work summary</th>
				<th className={styles.status}>Status</th>
				<th className={styles.actions}>actions</th>
			</CustomTablePaginate>
		</MainContentLayout>
	);

}

export default AllOTLogsAdmin;