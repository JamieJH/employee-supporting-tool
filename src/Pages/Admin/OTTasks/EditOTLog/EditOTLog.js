import React, { useState, useEffect } from 'react';
import { hideSpinner, openModal, showSpinner } from '../../../../redux/actions/actionCreators';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MainContentLayout } from '../../../../Components/index';
import { getUserAssociatedWithId } from '../../../../utils/commonMethods';
import OTFormAdmin from '../../../../Containers/OTForm/OTFormAdmin';
import firebase from 'firebase/app';
import 'firebase/database';


const EditOTLog = (props) => {
	const [logDetails, setLogDetails] = useState(null);
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		async function fetchData() {
			const logId = props.match.params.logId;

			const logDetails = await firebase.database().ref('/ot-logs/' + logId)
				.once('value')
				.then(snapshot => {
					return snapshot.val();
				})
				// .catch(err => {
				// 	console.log(err);
				// })

			if (!logDetails) {
				dispatch(openModal({
					type: 'error',
					content: 'Cannot get OT logs details, please try again later!'
				}))
				return;
			}

			const employee = await getUserAssociatedWithId(logDetails.employeeId);
			if (!employee) {
				dispatch(openModal({
					type: 'error',
					content: 'Cannot get employee details, please try again later!'
				}))
				return;
			}
			logDetails.employeeEmail = employee.email;

			if (logDetails.processorId) {
				const processor = await getUserAssociatedWithId(logDetails.processorId);
				if (!processor) {
					dispatch(openModal({
						type: 'error',
						content: 'Cannot get processor details, please try again later!'
					}))
					return
				}
				logDetails.processorEmail = processor.email;
			}

			logDetails.id = logId;
			setLogDetails(logDetails);
			dispatch(hideSpinner(false));
		}

		dispatch(showSpinner());
		fetchData();

	}, [dispatch, props.match.params.logId])


	const getFormInitialValues = () => {
		if (logDetails) {
			const editDetails = { ...logDetails };
			delete editDetails.processorId;
			delete editDetails.employeeId;
			delete editDetails.id;

			return editDetails;
		}
	}

	const onSubmitHandler = (newLogDetails) => {
		dispatch(showSpinner());

		firebase.database().ref('/ot-logs').child(logDetails.id).update(newLogDetails)
			.then(() => {
				dispatch(openModal({
					type: 'success',
					content: 'The log has been successfully updated!',
					okButtonHandler: () => history.push('/ot-logs')
				}))
			})
			.catch(() => {
				dispatch(openModal({
					content: 'Could not update this log, please try again later!'
				}))
			})
	}

	return logDetails &&
		<MainContentLayout
			title="Edit OT Log"
			description="Make changes to submitted OT logs">
			<OTFormAdmin
				action="edit"
				initialValues={getFormInitialValues()}
				onSubmitHandler={onSubmitHandler}
			/>

		</MainContentLayout>
		;
}

export default EditOTLog;