import React from 'react';
import uuid from 'uuid-random';
import OTForm, { uploadFilesToHost } from '../../../../Containers/OTForm/OTForm';
import { MainContentLayout } from '../../../../Components';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, showSpinner } from '../../../../redux/actions/modalSpinnerActions';
import { useLogOT } from '../../../../utils/customHooks';


const LogOTEmployee = () => {
	const dispatch = useDispatch();
	const logOTHandler = useLogOT();
	const employeeId = useSelector(state => state.auth.userId);
	const employeeEmail = useSelector(state => state.auth.userDetails.email);

	const onSubmitHandler = async (logDetails, files) => {
		dispatch(showSpinner());
		logDetails.employeeId = employeeId;
		logDetails.status = 'pending';

		const otLogId = uuid();

		if (files) {
			const uploadResults = await uploadFilesToHost(otLogId, files);
			if (!uploadResults.isSuccessful) {
				dispatch(openModal(uploadResults.modalDetails));
				return;
			}
			logDetails.files = uploadResults.files;
		}

		logOTHandler(otLogId, logDetails);
	}

	return (
		<MainContentLayout
			title="Log OT"
			description="Log OT work for processing.">
			<OTForm
				role="employee"
				currentUserEmail={employeeEmail}
				onSubmitHandler={onSubmitHandler}
				initialValues={{
					employeeEmail: employeeEmail
				}} />
		</MainContentLayout>
	);

}

export default LogOTEmployee;