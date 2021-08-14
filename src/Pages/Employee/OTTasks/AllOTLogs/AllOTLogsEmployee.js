import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideSpinner, showSpinner } from '../../../../redux/actions/modalSpinnerActions';
import * as PageCompos from '../../../../Components/pageComponents';
import OneOTLog from './OneOTLog/OneOTLog';
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
		<PageCompos.MainContentLayout
			title="Absent Requests"
			description="Review all absence requests you have made.">
			<PageCompos.AddDataButton title="Log OT" path="/log-ot" />
			<PageCompos.CustomTable>
				<thead>
					<tr>
						<th className={styles.workSummary}>Work summary</th>
						<th className={styles.dateTime}>Date & Time</th>
						<th className={styles.status}>Status</th>
						<th className={styles.processor}>processor</th>
						<th className={styles.processorComment}>Comment</th>
					</tr>
				</thead>
				<tbody>
					{PageCompos.getListContentToDisplay(6, logs, OneOTLog)}
				</tbody>
			</PageCompos.CustomTable>

		</PageCompos.MainContentLayout>
	);

}



export default AllOTLogsEmployee;