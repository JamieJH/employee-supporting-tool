import React, { useEffect, useState } from 'react';
import { inputDateToDateString, getUserAssociatedWithId } from '../../../../utils/commonMethods';
import { OTLogDetailsPropTypes } from '../../../../utils/customPropTypes';
import { AvatarNameEmail } from '../../../../Components/index';

const OneOTLog = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [processorInfo, setProcessorInfo] = useState(null);

	useEffect(() => {
		if (props.details.processorId) {
			setIsLoading(true);
			getUserAssociatedWithId(props.details.processorId)
				.then(processor => {
					setIsLoading(false);
					setProcessorInfo({
						fullName: processor.fullName,
						email: processor.email,
						image: processor.image
					})
				})
		}
	}, [props.details.processorId])

	const details = props.details;

	return isLoading
		? <tr><td colSpan='6'></td></tr>
		: <React.Fragment>
			<tr>
				<td>{details.workSummary}</td>
				<td>
					<p>{inputDateToDateString(details.date)}</p>
					<p>{details.fromTime}</p>
				</td>
				<td align="center">
					{details.duration}
				</td>
				<td align="center" data-status={details.status}>
					{details.status}
				</td>
				<td>
					{processorInfo &&
						<AvatarNameEmail
							email={processorInfo.email}
							image={processorInfo.image}
							fullName={processorInfo.fullName}
						/>}
				</td>
				<td>{details.processorComment}</td>
			</tr>
		</React.Fragment>
		;

}

OneOTLog.propTypes = {
	details: OTLogDetailsPropTypes
}

export default OneOTLog;