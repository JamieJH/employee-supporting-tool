import React from 'react';
import * as PageCompos from '../../../../Components/pageComponents';
import AbsenceFormAdmin from '../../../../Containers/AbsenceForm/AbsenceFormAdmin/AbsenceFormAdmin';
import { getUserAssociatedWithEmail } from '../../../../utils/commonMethods';
import { openModal, showSpinner } from '../../../../redux/actions/actionCreators';
import { useDispatch } from 'react-redux';
import { useAddAbsenceRequest } from '../../../../utils/customHooks';

const AddAbsenceRequestAdmin = () => {
	const dispatch = useDispatch();
	const addAbsenceRequest = useAddAbsenceRequest();

	const addAbsenceRequestHandler = (requestDetails) => {
		dispatch(showSpinner());
		const employeeEmail = requestDetails.employeeEmail;
		delete requestDetails.employeeEmail;

		getUserAssociatedWithEmail(employeeEmail)
			.then(employee => {
				let modalDetails;

				if (employee) {
					requestDetails.employeeId = employee.id;
					modalDetails = {
						type: 'warning',
						content: 'Press OK if you are sure all entered details are correct ',
						okButtonHandler: () => modalConfirmHandler(requestDetails),
					}
				}
				else {
					modalDetails = {
						type: 'error',
						title: 'email not found!',
						content: 'Cannot find any employee with email, please check your input.'
					}
				}
				setStateAfterExecution(modalDetails);
			})
	}

	const modalConfirmHandler = (requestDetails) => {
		addAbsenceRequest(requestDetails);
	}


	const setStateAfterExecution = (modalDetails) => {
		dispatch(openModal({ ...modalDetails }));
	}


	return (
		<PageCompos.MainContentLayout
			title="New Absence Request"
			description="Create an absence request for an employee" >
			<AbsenceFormAdmin action="add" onSubmitHandler={addAbsenceRequestHandler} />
		</PageCompos.MainContentLayout>
	);
}


export default AddAbsenceRequestAdmin;