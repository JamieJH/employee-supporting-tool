import React, { useState, useEffect } from 'react';
import { openModal, showSpinner } from '../../../../redux/actions/actionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { absenceRequestDetailsPropTypes } from '../../../../utils/customPropTypes'
import { inputDateToDateString } from '../../../../utils/commonMethods';
import { AvatarNameEmail, IconButton } from '../../../../Components/index';
import firebase from 'firebase/app';
import 'firebase/database';


const OneAbsenceRequest = (props) => {
	const [status, setStatus] = useState(props.details.status);
	const [userDetails, setUserDetails] = useState(null);
	const [processor, setProcessor] = useState(null);
	const currentAdminId = useSelector(state => state.auth.userId);
	const currentAdminName = useSelector(state => state.auth.userDetails.fullName);
	const currentAdminEmail = useSelector(state => state.auth.userDetails.email);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			const database = firebase.database();
			const promises = [];
			promises.push(database.ref('/users/' + props.details.employeeId).once('value'));

			if (props.details.processorId) {
				promises.push(database.ref('/users/' + props.details.processorId + '/fullName').once('value'));
			}

			Promise.all(promises)
				.then(snapshots => {
					return snapshots.map(snapshot => {
						return snapshot.val();
					})
				})
				.then(([userDetails, processorName]) => {
					setUserDetails({
						fullName: userDetails.fullName,
						email: userDetails.email,
						image: userDetails.image,
					});
					setProcessor(processorName);
				})
				.catch(() => {
					dispatch(openModal({
						type: 'error'
					}))
				})
		}
		fetchData();
	}, [dispatch, props.details.employeeId, props.details.processorId])

	const processRequestHandler = (action) => {
		dispatch(showSpinner())
		firebase.database().ref('/absence-requests/' + props.details.id)
			.update({
				processorId: currentAdminId,
				status: action
			})
			.then(() => {
				setStatus(action);
				setProcessor(currentAdminName);
				dispatch(openModal({
					content: "Absent request has been successfully " + action,
					type: 'success'
				}))
			})
			.catch(() => {
				dispatch(openModal({
					type: 'error'
				}))
			})
	}

	const onClickProcessButtonHandler = (action) => {
		if (userDetails.email === currentAdminEmail) {
			dispatch(openModal({
				type: "error",
				title: "Not allowed",
				content: "You are not allowed to Approve/Deny your own request",
			}))
		}
		else {
			dispatch(openModal({
				type: "warning",
				content: "Are you sure you want to approve/deny absence request?",
				okButtonHandler: () => processRequestHandler(action),
			}))
		}
	}

	const details = props.details;

	return !userDetails
		? <tr><td></td></tr>
		: <React.Fragment>
			<tr>
				<td>
					<AvatarNameEmail
						image={userDetails.image}
						fullName={userDetails.fullName}
						email={userDetails.email}
					/>
				</td>
				<td align="center">
					{inputDateToDateString(details.fromDate)} - {inputDateToDateString(details.toDate)}
				</td>
				<td>{details.reason}</td>
				<td data-status={status}>{status}</td>
				<td align="center">
					{processor}
				</td>
				<td align="center" style={{ whiteSpace: "nowrap" }} >
					<Link to={`/edit-request/${details.id}`}>
						<IconButton fontAwesomeCode="fas fa-eye" type="info" title="edit details" />
					</Link>

					{status === 'pending' &&
						<React.Fragment>
							<IconButton
								fontAwesomeCode="fas fa-check"
								type="success"
								title="approve request"
								onClick={() => onClickProcessButtonHandler('approved')}
							/>
							<IconButton
								fontAwesomeCode="fas fa-times"
								type="danger"
								title="deny request"
								onClick={() => onClickProcessButtonHandler('denied')}
							/>
						</React.Fragment>
					}
				</td>
			</tr>
			{/* {modal && <Modal key={modal.key} {...modal} />} */}
		</React.Fragment>
		;
}

OneAbsenceRequest.propTypes = {
	details: absenceRequestDetailsPropTypes.isRequired,
}

export default OneAbsenceRequest;