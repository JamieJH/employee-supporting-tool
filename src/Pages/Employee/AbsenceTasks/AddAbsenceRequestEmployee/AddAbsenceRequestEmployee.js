import React from 'react';
import { showSpinner, openModal } from '../../../../redux/actions/actionCreators';
import * as PageCompos from '../../../../Components/pageComponents';
import AbsenceFormEmployee from '../../../../Containers/AbsenceForm/AbsenceFormEmployee/AbsenceFormEmployee';
import { useDispatch } from 'react-redux';
import { useAddAbsenceRequest } from '../../../../utils/customHooks';

const AddAbsenceRequestEmployee = () => {
	const dispatch = useDispatch();
	const addAbsenceRequest = useAddAbsenceRequest();

	const formSubmitHandler = (requestDetails) => {
		const modalDetails = {
			type: 'warning',
			title: 'Are you sure?',
			content: 'This action is irreversible, Continue if all entered inputs are correct.',
			okMessage: 'Continue',
			okButtonHandler: () => confirmSubmitHandler(requestDetails),
			cancelMessage: 'Cancel'
		}
		dispatch(openModal(modalDetails));
	}

	const confirmSubmitHandler = (requestDetails) => {
		dispatch(showSpinner())
		addAbsenceRequest(requestDetails);
	}


	return (
		<PageCompos.MainContentLayout
			title="New Absence Request"
			description="Submit a request absence for processing.">

			<AbsenceFormEmployee onSubmitHandler={formSubmitHandler} />
		</PageCompos.MainContentLayout>
	);

}


export default AddAbsenceRequestEmployee;