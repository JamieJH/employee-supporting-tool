import React from 'react';
import uuid from 'uuid-random';
import { openModal, showSpinner } from '../../../../redux/actions/actionCreators';
import { useDispatch, useSelector } from 'react-redux';
import OTFormAdmin from '../../../../Containers/OTForm/OTFormAdmin';
import { uploadFilesToHost } from '../../../../Containers/OTForm/OTForm';
import { getUserAssociatedWithEmail } from '../../../../utils/commonMethods';
import * as PageCompos from '../../../../Components/pageComponents';
import { useLogOT } from '../../../../utils/customHooks';

const LogOTEmployee = () => {
	const processorId = useSelector(state => state.auth.userId);
	const processorEmail = useSelector(state => state.auth.userDetails.email);
	const dispatch = useDispatch();
	const logOTHandler = useLogOT();

	const initialValues = {
		status: 'pending',
		processorEmail: processorEmail,
		processorComment: ''
	}

	const onSubmitHandler = async (logDetails, employeeEmail, files) => {
		dispatch(showSpinner());

		const otLogId = uuid();
		const employee = await getUserAssociatedWithEmail(employeeEmail);

		if (!employee) {
			dispatch(openModal({
				content: "There's no user associated with this email"
			}));
			return;
		}

		delete logDetails.employeeEmail;
		delete logDetails.processor;
		logDetails.employeeId = employee.id;
		logDetails.processorId = processorId;


		if (files) {
			const uploadResults = await uploadFilesToHost(otLogId, files);

			if (!uploadResults.isSuccessful) {
				dispatch(openModal({ ...uploadResults.modalDetails }));
				return;
			}
			logDetails.files = uploadResults.files;
		}

		// save new log details 
		logOTHandler(otLogId, logDetails);
	}


	return (
		<PageCompos.MainContentLayout
			title="Log OT"
			description="Log OT work for an employee.">
			<OTFormAdmin
				action="add"
				initialValues={initialValues}
				onSubmitHandler={onSubmitHandler} />

		</PageCompos.MainContentLayout>

	);

}

export default LogOTEmployee;