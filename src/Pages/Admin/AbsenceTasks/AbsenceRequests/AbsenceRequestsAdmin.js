import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import * as PageCompos from '../../../../Components/pageComponents';
import OneAbsenceRequest from './OneAbsenceRequest';
import { useDispatch } from 'react-redux';
import { hideSpinner, showSpinner } from '../../../../redux/actions/modalSpinnerActions';

import styles from './AbsenceRequestsAdmin.module.css';

const AbsenceRequestsAdmin = () => {
	const [requests, setRequests] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(showSpinner());
		firebase.database().ref('/absence-requests')
			.once('value')
			.then(snapshot => {
				return snapshot.val();
			})
			.then(data => {
				const requests = [];
				for (const [id, details] of Object.entries(data)) {
					details.id = id;
					requests.push(details);
				}

				dispatch(hideSpinner());
				setRequests(requests);
			})
	}, [dispatch]);


	return requests && (
		<PageCompos.MainContentLayout
			title="Absent Requests"
			description="Review, approve, or deny requests">
			<PageCompos.AddDataButton title="Add Request" path="/new-request" />
			<PageCompos.CustomTable>
				<thead>
					<tr>
						<th className={styles.name}>Name</th>
						<th className={styles.duration}>duration</th>
						<th className={styles.reason}>Reason</th>
						<th className={styles.status}>Status</th>
						<th className={styles.processor}>processor</th>
						<th className={styles.actions}>Actions</th>
					</tr>
				</thead>
				<tbody>
					{PageCompos.getListContentToDisplay(5, requests, OneAbsenceRequest)}
				</tbody>
			</PageCompos.CustomTable>
		</PageCompos.MainContentLayout>
	);

}

export default AbsenceRequestsAdmin;