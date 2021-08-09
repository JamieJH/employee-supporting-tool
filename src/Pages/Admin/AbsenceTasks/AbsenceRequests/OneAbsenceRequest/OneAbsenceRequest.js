import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { absenceRequestDetailsPropTypes } from '../../../../../utils/customPropTypes'
import { timestampInSecsToDate } from '../../../../../utils/commonMethods';
import AvatarNameEmail from '../../../../../Components/UI/AvatarNameEmail/AvatarNameEmail';
import IconButton from '../../../../../Components/UI/IconButton/IconButton';
import { connect } from 'react-redux';
import Modal from '../../../../../Components/UI/Modal/Modal';
import firebase from 'firebase';
import 'firebase/database';


class OneAbsenceRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            status: this.props.details.status,
            modal: null,
        }

        this.processRequestHandler = this.processRequestHandler.bind(this);
        this.onClickProcessButtonHandler = this.onClickProcessButtonHandler.bind(this);
    }

    componentDidMount() {
        const database = firebase.database();
        let userDetails = {};
        let processor = '';

        database.ref('/users/' + this.props.details.employeeId)
            .once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .then(user => {
                userDetails = {
                    fullName: user.fullName,
                    email: user.email,
                    image: user.image
                }
            })
            .then(async () => {
                if (this.props.details.processorId) {
                    await database.ref('/users/' + this.props.details.processorId + '/fullName')
                        .once('value')
                        .then(snapshot => {
                            return snapshot.val();
                        })
                        .then(name => {
                            processor = name;
                        })
                }
            })
            .then(() => {
                this.setState({
                    isLoading: false,
                    userDetails: userDetails,
                    processor: processor,
                })
            })
            .catch(err => {
                throw (new Error("CANNOT GET USER DETAILS: ", err));
            })
    }

    processRequestHandler(action) {
        this.setState({
            isLoading: true
        })
        firebase.database().ref('/absence-requests/' + this.props.details.id)
            .update({
                processorId: this.props.adminId,
                status: action
            })
            .then(() => {
                this.setState({
                    status: action,
                    isLoading: false,
                    modal: {
                        key: Math.random(),
                        type: "success",
                        content: "This absent request has been successfully " + action,
                    }
                })
            })
            .catch(() => {
                this.setState({
                    isLoading: false,
                    modal: {
                        type: "error",
                        content: "Something went wrong, please try again later!"
                    }
                })
            })
    }

    onClickProcessButtonHandler(action) {
        this.setState({
            modal: {
                key: Math.random(),
                type: "warning",
                content: "Are you sure you want to approve/deny this absence request?",
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
                            image={this.state.userDetails.image}
                            fullName={this.state.userDetails.fullName}
                            email={this.state.userDetails.email}
                        />
                    </td>
                    <td align="center">
                        {timestampInSecsToDate(details.fromDate)} - {timestampInSecsToDate(details.toDate)}
                    </td>
                    <td>{details.reason}</td>
                    <td data-status={this.state.status}>{this.state.status}</td>
                    <td align="center">
                        {this.state.processor}
                    </td>
                    <td align="center" style={{whiteSpace: "nowrap"}} >
                        <Link to={`/edit-request/${details.id}`}>
                            <IconButton fontAwesomeCode="fa-pen" type="info" title="edit details" />
                        </Link>

                        {this.state.status === 'pending' &&
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
                {this.state.modal && <Modal key={this.state.modal.key} {...this.state.modal} />}
            </React.Fragment>
            ;
    }
}

OneAbsenceRequest.propTypes = {
    adminId: PropTypes.string.isRequired,
    adminName: PropTypes.string.isRequired,
    details: absenceRequestDetailsPropTypes.isRequired,
}

const mapStateToProps = (state) => {
    return {
        adminId: state.auth.userId,
        adminName: state.auth.userDetails.fullName,
    }
}

export default connect(mapStateToProps, null)(OneAbsenceRequest);