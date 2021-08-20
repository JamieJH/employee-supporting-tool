import React, { useState, useEffect } from 'react';
import { MainContentLayout } from '../../../../Components';
import AbsenceFormAdmin from '../../../../Containers/AbsenceForm/AbsenceFormAdmin/AbsenceFormAdmin';
import { getUserAssociatedWithId } from '../../../../utils/commonMethods';
import { hideSpinner, openModal, showSpinner } from '../../../../redux/actions/actionCreators';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/database';
import { useHistory } from 'react-router-dom';

const EditAbsenceRequest = (props) => {
	const [requestDetails, setRequestDetails] = useState(null);
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		async function fetchData() {
			const requestId = props.match.params.requestId;

			// get absence information
			const requestDetails = await firebase.database().ref('/absence-requests/' + requestId)
				.once('value')
				.then(snapshot => {
					return snapshot.val();
				})

			if (!requestDetails) {
				dispatch(openModal({
					content: 'Cannot get this request details, try again later!'
				}))
				return;
			}


			// get processor name
			if (requestDetails.processorId) {
				const processor = await getUserAssociatedWithId(requestDetails.processorId);
				if (!processor) {
					dispatch(openModal({
						content: 'Cannot get processor information, try again later!'
					}))
					return
				}
				requestDetails.processorFullName = processor.fullName;
			}

			// get absence request employee email and id
			const employee = await getUserAssociatedWithId(requestDetails.employeeId);
			if (!employee) {
				dispatch(openModal({
					content: 'Cannot get employee information, try again later!'
				}))
				return;
			}
			requestDetails.employeeEmail = employee.email;
			requestDetails.id = requestId;

			setRequestDetails(requestDetails);
			dispatch(hideSpinner());
		}
		dispatch(showSpinner());
		fetchData();
	}, [dispatch, props.match.params.requestId])

	const editAbsenceRequestHandler = (requestDetails) => {
		console.log(requestDetails);
		const requestId = requestDetails.id;
		delete requestDetails.id;
		delete requestDetails.processorFullName;
		delete requestDetails.employeeEmail;
		dispatch(openModal({
			type: 'warning',
			content: 'Press OK if you are sure all entered details are correct ',
			okButtonHandler: () => modalConfirmHandler(requestDetails, requestId),
		}))
	}

	const modalConfirmHandler = (requestDetails, requestId) => {
		dispatch(showSpinner());
		firebase.database().ref('/absence-requests/' + requestId)
			.set(requestDetails)
			.then(() => {
				dispatch(openModal({
					type: 'success',
					content: 'The request has been succecssfully updated!',
					okButtonHandler: () => history.push('/absence-requests')
				}))
			})
			.catch(() => {
				dispatch(openModal({
					type: 'error'
				}))
			})
	}


	return requestDetails && (
		<MainContentLayout
			title="Edit Request"
			description="Edit absence duration and its status">
			<AbsenceFormAdmin
				action="edit"
				requestDetails={requestDetails}
				onSubmitHandler={editAbsenceRequestHandler}
			/>
		</MainContentLayout>
	);
}

export default EditAbsenceRequest;