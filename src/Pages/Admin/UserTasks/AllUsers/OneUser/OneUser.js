import React, { Component } from 'react';
import { userDetailsPropTypes } from '../../../../../utils/customPropTypes';
import { Link } from 'react-router-dom';
import AvatarNameEmail from '../../../../../Components/UI/AvatarNameEmail/AvatarNameEmail';
import IconButton from '../../../../../Components/UI/IconButton/IconButton';
import { timestampInSecsToDate } from '../../../../../utils/commonMethods';


class OneEmployee extends Component {
    render() {
        const details = this.props.details;

        return (
            <tr>
                <td>
                    <AvatarNameEmail
                        image={this.props.details.image}
                        fullName={this.props.details.fullName}
                        email={this.props.details.email} />
                </td>
                <td align="center">
                    {details.role}
                </td>
                <td align="center">
                    {details.position}
                </td>
                <td align="center" >
                    {timestampInSecsToDate(details.dateStarted)}
                </td>
                <td align="center" style={{whiteSpace: 'nowrap'}} >
                    <Link to={{
                        pathname: `/employee/${details.id}`,
                        // state: {
                        //     userDetails: details
                        // }
                    }}>
                        <IconButton fontAwesomeCode="fa-info" type="info" title="see user details" />
                    </Link>
                    <IconButton fontAwesomeCode="fa-times" type="danger" title="remove user from system" />
                </td>
            </tr>
        );
    }
}

OneEmployee.propTypes = {
    details: userDetailsPropTypes.isRequired
}

export default OneEmployee;