import React, { useState, useEffect } from 'react';
import { openModal, showSpinner, hideSpinner } from '../../../../redux/actions/actionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { inputDateToDateString, getUserAssociatedWithId } from '../../../../utils/commonMethods';
import { OTLogDetailsPropTypes } from '../../../../utils/customPropTypes';
import { AvatarNameEmail, IconButton } from '../../../../Components/index';
import firebase from 'firebase/app';
import 'firebase/database';

const OneOTLogAdmin = (props) => {
	const [employeeInfo, setEmployeInfo] = useState(null);
	const [status, setStatus] = useState(props.details.status);
	const dispatch = useDispatch();
	const currentAdminId = useSelector(state => state.auth.userId);
	const currentAdminEmail = useSelector(state => state.auth.userDetails.email);

	useEffect(() => {
		getUserAssociatedWithId(props.details.employeeId)
			.then(employee => {
				setEmployeInfo({
					fullName: employee.fullName,
					email: employee.email,
					image: employee.image
				})
				dispatch(hideSpinner());
			})
	}, [dispatch, props.details.employeeId])


	const processRequestHandler = (action) => {
		dispatch(showSpinner())
		firebase.database().ref('/ot-logs/' + props.details.id)
			.update({
				processorId: currentAdminId,
				status: action
			})
			.then(() => {
				setStatus(action);
				dispatch(openModal({
					type: "success",
					content: "This absent request has been successfully " + action,
				}))
			})
			.catch(() => {
				dispatch(openModal({
					type: "error",
					content: "Something went wrong, please try again later!"
				}))
			})
	}

	const onClickProcessButtonHandler = (action) => {
		if (employeeInfo.email === currentAdminEmail) {
			dispatch(openModal({
				type: "error",
				title: "Not allowed",
				content: "You are not allowed to Approve/Deny your own log",
			}))
		}
		else {
			dispatch(openModal({
				type: "warning",
				content: "Are you sure you want to approve/deny this OT log?",
				okButtonHandler: () => processRequestHandler(action),
			}))
		}
	}

	const details = props.details;

	return !employeeInfo
		? <tr><td></td></tr>
		: <React.Fragment>
			<tr>
				<td>
					<AvatarNameEmail
						email={employeeInfo.email}
						image={employeeInfo.image}
						fullName={employeeInfo.fullName}
					/>
				</td>
				<td>
					<p>{inputDateToDateString(details.date)}</p>
					<p>{details.fromTime}</p>
				</td>
				<td align="center">
					{details.duration}
				</td>
				<td>{details.workSummary}</td>
				<td data-status={status}>
					{status}
				</td>
				<td align="center" style={{ whiteSpace: 'nowrap' }}>
					<Link to={`/edit-ot/${details.id}`}>
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
		</React.Fragment>
		;
}


OneOTLogAdmin.propTypes = {
	details: OTLogDetailsPropTypes
}

export default OneOTLogAdmin;