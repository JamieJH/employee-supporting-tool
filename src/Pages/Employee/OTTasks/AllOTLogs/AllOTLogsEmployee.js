import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideSpinner, showSpinner } from '../../../../redux/actions/modalSpinnerActions';
import { MainContentLayout, AddDataButton } from '../../../../Components';
import CustomTablePaginate from '../../../../Containers/CustomTablePaginate/CustomTablePaginate';
import OneOTLog from './OneOTLog';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './AllOTLogsEmployee.module.css';

const AllOTLogsEmployee = () => {
	const [logs, setLogs] = useState(null);
	const employeeId = useSelector(state => state.auth.userId);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(showSpinner());
		firebase.database().ref('/ot-logs').orderByChild('employeeId').equalTo(employeeId)
			.once('value')
			.then(snapshot => {
				return snapshot.val();
			})
			.then(data => {
				const logs = [];
				for (const [id, details] of Object.entries(data)) {
					details.id = id;
					logs.push(details);
				}

				dispatch(hideSpinner());
				setLogs(logs);
			})
	}, [dispatch, employeeId])



	return (logs) && (
		<MainContentLayout
			title="OT Logs"
			description="Review the status of all logs you have made.">
			<AddDataButton title="Log OT" path="/log-ot" />
			<CustomTablePaginate items={logs} oneItemComponent={OneOTLog} maxCol={6}>
				<th className={styles.workSummary}>Work summary</th>
				<th className={styles.dateTime}>Date & Time Started</th>
				<th className={styles.duration}>Duration (hours)</th>
				<th className={styles.status}>Status</th>
				<th className={styles.processor}>processor</th>
				<th className={styles.processorComment}>Comment</th>
			</CustomTablePaginate>
		</MainContentLayout>
	);

}



export default AllOTLogsEmployee;