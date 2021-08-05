import React, { Component } from 'react';
import { timestampInSecsToDate, getUserAssociatedWithId } from '../../../../../utils/commonMethods';
import { absenceRequestDetailsPropTypes } from '../../../../../utils/customPropTypes';

import styles from './OneAbsenceRequestEmployee.module.css'

class OneAbsenceRequestEmployee extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            processorInfo: null
        }
    }

    componentDidMount() {
        if (this.props.details.processorId) {
            this.setState({
                isLoading: true
            })
            getUserAssociatedWithId(this.props.details.processorId)
                .then(processor => {
                    this.setState({
                        isLoading: false,
                        processorInfo: {
                            fullName: processor.fullName,
                            email: processor.email
                        }
                    })
                })
        }
    }

    render() {
        const details = this.props.details;

        return this.state.isLoading
            ? <tr><td></td></tr>
            : <React.Fragment>
                <tr className={styles[details.status]}>
                    <td className={styles.reason}>
                        {details.reason}
                    </td>

                    <td className={styles.duration}>
                        {timestampInSecsToDate(details.fromDate)} - {timestampInSecsToDate(details.toDate)}
                    </td>
                    <td className={styles.status}>
                        {details.status}
                    </td>
                    <td className={styles.processor}>
                        {this.state.processorInfo &&
                            <React.Fragment>
                                <p className={styles.nameText}>{this.state.processorInfo.fullName}</p>
                                <p className={styles.emailText}>{this.state.processorInfo.email}</p>
                            </React.Fragment>}
                    </td>
                    <td className={styles.processorComment}>
                        {details.processorComment}
                    </td>
                </tr>
            </React.Fragment>
            ;
    }
}

OneAbsenceRequestEmployee.propTypes = {
    details: absenceRequestDetailsPropTypes
}

export default OneAbsenceRequestEmployee;