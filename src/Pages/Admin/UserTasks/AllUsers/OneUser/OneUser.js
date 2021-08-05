import React, { Component } from 'react';
import { userDetailsPropTypes } from '../../../../../utils/customPropTypes';
import { Link } from 'react-router-dom';
import AvatarNameEmail from '../../../../../Components/UI/AvatarNameEmail/AvatarNameEmail';
import IconButton from '../../../../../Components/UI/IconButton/IconButton';
import { timestampInSecsToDate } from '../../../../../utils/commonMethods';

import styles from './OneUser.module.css'

class OneEmployee extends Component {
    render() {
        const details = this.props.details;

        return (
            <tr>
                <td className={styles.nameEmail}>
                    <AvatarNameEmail
                        image={this.props.details.image}
                        fullName={this.props.details.fullName}
                        email={this.props.details.email} />
                </td>
                <td className={styles.position}>
                    {details.position}
                </td>
                <td className={styles.dateStarted}>
                    {timestampInSecsToDate(details.dateStarted)}
                </td>
                <td className={styles.actions}>
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