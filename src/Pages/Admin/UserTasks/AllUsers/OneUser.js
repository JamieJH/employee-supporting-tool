import React from 'react';
import { userDetailsPropTypes } from '../../../../utils/customPropTypes';
import { Link } from 'react-router-dom';
import { IconButton, AvatarNameEmail } from '../../../../Components/index';
import { inputDateToDateString } from '../../../../utils/commonMethods';


const OneEmployee = (props) => {
	const details = props.details;

	return (
		<tr>
			<td>
				<AvatarNameEmail
					image={details.image}
					fullName={details.fullName}
					email={details.email} />
			</td>
			<td align="center">
				{details.role}
			</td>
			<td align="center">
				{details.employeeType}
			</td>
			<td align="center">
				{details.position}
			</td>
			<td align="center">
				{inputDateToDateString(details.dateStarted)}
			</td>
			<td align="center" style={{ whiteSpace: 'nowrap' }} >
				<Link to={`/employee/${details.id}`}>
					<IconButton fontAwesomeCode="fas fa-info" type="info" title="see user details" />
				</Link>
				{/* <IconButton fontAwesomeCode="fas fa-times" type="danger" title="remove user from system" /> */}
			</td>
		</tr>
	);

}

OneEmployee.propTypes = {
	details: userDetailsPropTypes.isRequired
}

export default OneEmployee;