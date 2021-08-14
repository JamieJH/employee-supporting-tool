import React, { useEffect } from 'react';
import { inputDateToDateString, getUserAssociatedWithId } from '../../../../../utils/commonMethods';
import { OTLogDetailsPropTypes } from '../../../../../utils/customPropTypes';
import { AvatarNameEmail } from '../../../../../Components/index';
import { useState } from 'react';

const OneOTLog = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [processorInfo, setProcessorInfo] = useState(null);

	useEffect(() => {
		if (props.details.processorId) {
			console.log('hi');
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
	console.log(details);

	return isLoading
		? <tr><td></td></tr>
		: <React.Fragment>
			<tr>
				<td>{details.workSummary}</td>
				<td>
					<p>{inputDateToDateString(details.date)}</p>
					<p>{`${details.fromTime}h - ${details.toTime}h`}</p>
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