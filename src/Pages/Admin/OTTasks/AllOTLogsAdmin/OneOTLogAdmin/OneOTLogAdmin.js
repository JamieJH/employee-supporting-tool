import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { timestampInSecsToDate, getUserAssociatedWithId } from '../../../../../utils/commonMethods';
import { OTLogDetailsPropTypes } from '../../../../../utils/customPropTypes';
import AvatarNameEmail from '../../../../../Components/UI/AvatarNameEmail/AvatarNameEmail';
import IconButton from '../../../../../Components/UI/IconButton/IconButton';
import firebase from 'firebase/app';
import 'firebase/database';

class OneOTLogAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            employeeInfo: null
        }
        
        this.processRequestHandler = this.processRequestHandler.bind(this);
        this.onClickProcessButtonHandler = this.onClickProcessButtonHandler.bind(this);
    }

    componentDidMount() {
        getUserAssociatedWithId(this.props.details.employeeId)
            .then(employee => {
                this.setState({
                    isLoading: false,
                    employeeInfo: {
                        fullName: employee.fullName,
                        email: employee.email,
                        image: employee.image
                    }
                })
            })

    }

    processRequestHandler(action) {
        this.setState({
            isLoading: true
        })
        firebase.database().ref('/ot-logs /' + this.props.details.id)
            .update({
                processorId: this.props.adminId,
                status: action
            })
            .then(() => {
                return {
                    status: action,
                    modal: {
                        type: "success",
                        content: "This absent request has been successfully " + action,
                    }
                }
            })
            .catch(() => {
                return {
                    modal: {
                        type: "error",
                        content: "Something went wrong, please try again later!"
                    }
                }
            })
            .then(stateDetails => {
                stateDetails.modal.key = Math.random();
                this.setState({
                    isLoading: false,
                    ...stateDetails,
                })
            })
    }

    onClickProcessButtonHandler(action) {
        this.setState({
            modal: {
                key: Math.random(),
                type: "warning",
                content: "Are you sure you want to approve/deny this OT log?",
                okButtonHandler: () => this.processRequestHandler(action),
            }
        })
    }

    render() {
        const details = this.props.details;

        return this.state.isLoading
            ? <tr><td></td></tr>
            : <React.Fragment>
                <tr>
                    <td>
                        <AvatarNameEmail
                            email={this.state.employeeInfo.email}
                            image={this.state.employeeInfo.image}
                            fullName={this.state.employeeInfo.fullName}
                        />
                    </td> 
                    <td>
                        <p>{timestampInSecsToDate(details.date)}</p>
                        <p>{`${details.fromTime}h - ${details.toTime}h`}</p>
                    </td>

                    <td>{details.workSummary}</td>
                    <td data-status={details.status}>
                        {details.status}
                    </td>
                    <td align="center" style={{whiteSpace: 'nowrap'}}>
                        <Link to={`/edit-ot/${details.id}`}>
                            <IconButton fontAwesomeCode="fa-eye" type="info" title="edit details" />
                        </Link>

                        {details.status === 'pending' &&
                            <React.Fragment>
                                <IconButton
                                    fontAwesomeCode="fa-check"
                                    type="success"
                                    title="approve request"
                                    onClick={() => this.onClickProcessButtonHandler('approved')}
                                />
                                <IconButton
                                    fontAwesomeCode="fa-times"
                                    type="danger"
                                    title="deny request"
                                    onClick={() => this.onClickProcessButtonHandler('denied')}
                                />
                            </React.Fragment>
                        }
                    </td>
                </tr>
            </React.Fragment>
            ;
    }

}

OneOTLogAdmin.propTypes = {
    details: OTLogDetailsPropTypes
}

export default OneOTLogAdmin;