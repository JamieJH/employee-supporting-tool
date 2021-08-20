import React, { useState, useEffect } from 'react';
import { hideSpinner, showSpinner } from '../../../../redux/actions/actionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { MainContentLayout, AddDataButton } from '../../../../Components/index';
import CustomTablePaginate from '../../../../Containers/CustomTablePaginate/CustomTablePaginate';
import OneUser from './OneUser';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './AllUsers.module.css';

const AllUsers = () => {
	const [employees, setEmployees] = useState(null);
	const role = useSelector(state => state.auth.role);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(showSpinner());
		let usersDbRef = firebase.database().ref('/users').orderByChild('role');
		usersDbRef = (role === 'admin') ? usersDbRef.equalTo('employee') : usersDbRef;
		usersDbRef.once('value')
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
	}, [dispatch, role])

	return (employees) && (
		<MainContentLayout
			title="Employee List"
			description="Review, remove an employee">
			<AddDataButton title="New User" path="/add-user" />
			<CustomTablePaginate items={employees} oneItemComponent={OneUser} maxCol={6}>
				<th className={styles.name}>Name</th>
				<th className={styles.role}>user type</th>
				<th className={styles.employeeType}>employee Type</th>
				<th className={styles.position}>Position</th>
				<th className={styles.date}>Date Started</th>
				<th className={styles.actions}>Actions</th>
			</CustomTablePaginate>
		</MainContentLayout>
	);
}

export default AllUsers;