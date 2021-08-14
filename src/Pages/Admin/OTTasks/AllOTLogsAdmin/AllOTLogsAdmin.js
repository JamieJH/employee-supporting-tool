import React, { useState, useEffect } from 'react';
import * as PageCompos from '../../../../Components/pageComponents';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../../../redux/actions/modalSpinnerActions';
import OneOTLogAdmin from './OneOTLogAdmin/OneOTLogAdmin';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './AllOTLogsAdmin.module.css';

const AllOTLogsAdmin = () => {
	const [logs, setLogs] = useState(null);
	const dispatch = useDispatch();
	console.log('ot logs');

	useEffect(() => {
		dispatch(showSpinner());
		firebase.database().ref('/ot-logs')
			.once('value')
			.then(snapshot => {
				return snapshot.val();
			})
			.then(data => {
				console.log(data);
				const logs = [];
				for (const [id, details] of Object.entries(data)) {
					details.id = id;
					logs.push(details);
				}

				setLogs(logs);
			})
	}, [dispatch])


	return (logs) && (
		<PageCompos.MainContentLayout
			title="OT Logs"
			description="Review the status of all logs you have made.">
			<PageCompos.AddDataButton title="Log OT" path="/log-ot" />
			<PageCompos.CustomTable>
				<thead>
					<tr>
						<th className={styles.employee}>Employee</th>
						<th className={styles.dateTime}>Date and Time</th>
						<th className={styles.workSummary}>Work summary</th>
						<th className={styles.status}>Status</th>
						<th className={styles.actions}>actions</th>
					</tr>
				</thead>
				<tbody>
					{PageCompos.getListContentToDisplay(5, logs, OneOTLogAdmin)}
				</tbody>
			</PageCompos.CustomTable>
		</PageCompos.MainContentLayout>
	);

}

export default AllOTLogsAdmin;