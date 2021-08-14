import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { AvatarNameEmail } from '../../../../../Components/index';
import { inputDateToDateString, getUserAssociatedWithId } from '../../../../../utils/commonMethods';
import { absenceRequestDetailsPropTypes } from '../../../../../utils/customPropTypes';

const OneAbsenceRequestEmployee = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [processorInfo, setProcessorInfo] = useState(null);

	useEffect(() => {
		if (props.details.processorId) {
			getUserAssociatedWithId(props.details.processorId)
				.then(processor => {
					setProcessorInfo({
						fullName: processor.fullName,
						email: processor.email,
						image: processor.image
					})
				})
		}
		setIsLoading(false);
	}, [props.details.processorId])

	const details = props.details;

	return isLoading
		? <tr><td></td></tr>
		: <React.Fragment>
			<tr>
				<td>{details.reason}</td>
				<td align="center">
					{inputDateToDateString(details.fromDate)} - {inputDateToDateString(details.toDate)}
				</td>
				<td align="center" data-status={details.status}>
					{details.status}
				</td>
				<td >
					{processorInfo &&
						<AvatarNameEmail
							image={processorInfo.image}
							email={processorInfo.email}
							fullName={processorInfo.fullName}
						/>}
				</td>
				<td>{details.processorComment}</td>
			</tr>
		</React.Fragment>
		;

}

OneAbsenceRequestEmployee.propTypes = {
	details: absenceRequestDetailsPropTypes
}

export default OneAbsenceRequestEmployee;