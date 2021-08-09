import React, { Component } from 'react';
import { timestampInSecsToDate, getUserAssociatedWithId } from '../../../../../utils/commonMethods';
import { OTLogDetailsPropTypes } from '../../../../../utils/customPropTypes';
import AvatarNameEmail from '../../../../../Components/UI/AvatarNameEmail/AvatarNameEmail';

class OneOTLog extends Component {
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
                            email: processor.email,
                            image: processor.image
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
                    <td>{details.workSummary}</td>
                    <td>
                        <p>{timestampInSecsToDate(details.date)}</p>
                        <p>{`${details.fromTime}h - ${details.toTime}h`}</p>                      
                    </td>

                    <td align="center" data-status={details.status}>
                        {details.status}
                    </td>
                    <td>
                        {this.state.processorInfo &&
                            <AvatarNameEmail
                                email={this.state.processorInfo.email}
                                image={this.state.processorInfo.image}
                                fullName={this.state.processorInfo.fullName}
                            />}
                    </td>
                    <td>{details.processorComment}</td>
                </tr>
            </React.Fragment>
            ;
    }

}

OneOTLog.propTypes = {
    details: OTLogDetailsPropTypes
}

export default OneOTLog;