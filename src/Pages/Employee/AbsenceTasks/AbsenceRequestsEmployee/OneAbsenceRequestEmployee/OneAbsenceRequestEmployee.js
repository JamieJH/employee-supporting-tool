import React, { Component } from 'react';
import AvatarNameEmail from '../../../../../Components/UI/AvatarNameEmail/AvatarNameEmail';
import { timestampInSecsToDate, getUserAssociatedWithId } from '../../../../../utils/commonMethods';
import { absenceRequestDetailsPropTypes } from '../../../../../utils/customPropTypes';

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
                <tr>
                    <td>{details.reason}</td>

                    <td align="center">
                        {timestampInSecsToDate(details.fromDate)} - {timestampInSecsToDate(details.toDate)}
                    </td>
                    <td align="center">{details.status}</td>
                    <td >
                        {this.state.processorInfo &&
                            <AvatarNameEmail
                                email={this.state.processorInfo.email}
                                fullName={this.state.processorInfo.fullName}
                            />}
                    </td>
                    <td>{details.processorComment}</td>
                </tr>
            </React.Fragment>
            ;
    }
}

OneAbsenceRequestEmployee.propTypes = {
    details: absenceRequestDetailsPropTypes
}

export default OneAbsenceRequestEmployee;