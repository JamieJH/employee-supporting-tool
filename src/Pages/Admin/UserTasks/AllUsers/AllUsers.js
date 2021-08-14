import React, { useState, useEffect } from 'react';
import { hideSpinner, showSpinner } from '../../../../redux/actions/actionCreators';
import { useDispatch } from 'react-redux';
import * as PageCompos from '../../../../Components/pageComponents';
import OneUser from './OneUser/OneUser';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './AllUsers.module.css';

const AllUsers = () => {
	const [employees, setEmployees] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(showSpinner());
		const usersDbRef = firebase.database().ref('/users');

		usersDbRef.orderByChild('role').equalTo('employee').once('value')
			.then(snapshot => {
				return snapshot.val();
			})
			.then(users => {
				const employees = [];
				for (const [id, userDetails] of Object.entries(users)) {
					userDetails.id = id;
					employees.push(userDetails);
				}
				dispatch(hideSpinner())
				setEmployees(employees);
			})
	}, [dispatch])

	return (employees) && (
		<PageCompos.MainContentLayout
			title="Employee List"
			description="Review, remove an employee">
			<PageCompos.AddDataButton title="New User" path="/add-user" />
			<PageCompos.CustomTable>
				<thead>
					<tr>
						<th className={styles.name}>Name</th>
						<th className={styles.role}>user type</th>
						<th className={styles.employeeType}>employee Type</th>
						<th className={styles.position}>Position</th>
						<th className={styles.date}>Date Started</th>
						<th className={styles.actions}>Actions</th>
					</tr>
				</thead>
				<tbody>
					{PageCompos.getListContentToDisplay(5, employees, OneUser)}
				</tbody>
			</PageCompos.CustomTable>
		</PageCompos.MainContentLayout>
	);
}

export default AllUsers;