import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { absenceRequestDetailsPropTypes } from '../../../../utils/customPropTypes'
import { timestampInSecsToDate } from '../../../../utils/commonMethods';
import AvatarNameEmail from '../../../../Components/UI/AvatarNameEmail/AvatarNameEmail';
import IconButton from '../../../../Components/UI/IconButton/IconButton';
import { connect } from 'react-redux';
import Modal from '../../../../Components/UI/Modal/Modal';
import firebase from 'firebase';
import 'firebase/database';

import styles from './OneAbsenceRequest.module.css';

class OneAbsenceRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            status: this.props.details.status,
            modal: {
                count: 0
            },
        }

        this.processRequestHandler = this.processRequestHandler.bind(this);
        this.onClickProcessButtonHandler = this.onClickProcessButtonHandler.bind(this);
    }

    componentDidMount() {
        const database = firebase.database();
        let userDetails = {};
        let supervisor = '';

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
                if (this.props.details.acceptedBy) {
                    await database.ref('/users/' + this.props.details.acceptedBy + '/fullName')
                        .once('value')
                        .then(snapshot => {
                            return snapshot.val();
                        })
                        .then(name => {
                            supervisor = name;
                        })
                }
            })
            .then(() => {
                this.setState({
                    isLoading: false,
                    userDetails: userDetails,
                    supervisor: supervisor,
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
        firebase.database().ref('/absent-requests/' + this.props.details.id)
            .update({
                acceptedBy: this.props.adminId,
                status: action
            })
            .then(() => {
                this.setState(state => {
                    return {
                        isLoading: false,
                        status: action,
                        modal: {
                            count: state.modal.count + 1,
                            type: "success",
                            content: "This absent request has been successfully " + action,
                            okMessage: "OK",
                        }
                    }
                })
            })
            .catch(() => {
                this.setState(state => {
                    return {
                        isLoading: false,
                        modal: {
                            count: state.modal.count + 1,
                            type: "error",
                            content: "Something went wrong, please try again later!"
                        }
                    }
                })
            })
    }

    onClickProcessButtonHandler(action) {
        this.setState(state => {
            return {
                modal: {
                    count: state.modal.count + 1,
                    type: "warning",
                    title: "Are you sure?",
                    content: "Are you sure you want to approve/deny this absence request?",
                    okMessage: "Proceed",
                    okButtonHandler: () => this.processRequestHandler(action),
                    cancelMessage: "Cancel"
                }
            }
        })
    }


    render() {
        console.log(this.props);

        const details = this.props.details;

        return this.state.isLoading
            ? <tr><td></td></tr>
            : <React.Fragment>
                <tr className={styles[this.state.status]}>
                    <td className={styles.nameEmail}>
                        <AvatarNameEmail
                            image={this.state.userDetails.image}
                            fullName={this.state.userDetails.fullName}
                            email={this.state.userDetails.email}
                        />
                    </td>
                    <td className={styles.duration}>
                        {timestampInSecsToDate(details.from)} - {timestampInSecsToDate(details.to)}
                    </td>
                    <td className={styles.reason}>
                        {details.reason}
                    </td>
                    <td className={styles.status}>
                        {this.state.status}
                    </td>
                    <td className={styles.supervisor}>
                        {this.state.supervisor}
                    </td>
                    <td className={styles.actions}>
                        <IconButton
                            fontAwesomeCode="fa-pen"
                            type="info"
                            title="edit details"
                            onClick={() => console.log('edit')}
                        />
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
                {this.state.modal.count !== 0 &&
                    <Modal key={this.state.modal.count} {...this.state.modal} />}
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