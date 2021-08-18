import React, { useState, useEffect } from 'react';
import { hideSpinner, showSpinner } from '../../../../redux/actions/actionCreators';
import { useDispatch, useSelector } from 'react-redux';
import * as PageCompos from '../../../../Components/pageComponents';
import OneAbsenceRequestEmployee from './OneAbsenceRequestEmployee';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './AbsenceRequestsEmployee.module.css';

const AbsenceRequestsEmployee = () => {
	const [requests, setRequests] = useState(null);
	const employeeId = useSelector(state => state.auth.userId);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(showSpinner())
		firebase.database().ref('/absence-requests').orderByChild('employeeId').equalTo(employeeId)
			.once('value')
			.then(snapshot => {
				return snapshot.val();
			})
			.then(data => {
				console.log(data);
				const requests = [];
				for (const [id, details] of Object.entries(data)) {
					details.id = id;
					requests.push(details);
				}
				dispatch(hideSpinner())
				setRequests(requests);
			})
	}, [employeeId, dispatch])

	return (requests) && (
		<PageCompos.MainContentLayout
			title="Absent Requests"
			description="Review all absence requests you have made.">
			<PageCompos.AddDataButton title="New Request" path="/new-request" />
			<PageCompos.CustomTable>
				<thead>
					<tr>
						<th className={styles.reason}>Reason</th>
						<th className={styles.duration}>duration</th>
						<th className={styles.status}>Status</th>
						<th className={styles.processor}>processor</th>
						<th className={styles.processorComment}>Comment</th>
					</tr>
				</thead>
				<tbody>
					{PageCompos.getListContentToDisplay(5, requests, OneAbsenceRequestEmployee)}
				</tbody>
			</PageCompos.CustomTable>
		</PageCompos.MainContentLayout>
	);

}


export default AbsenceRequestsEmployee;