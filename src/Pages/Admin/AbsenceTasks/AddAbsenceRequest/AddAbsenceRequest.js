import React, { Component } from 'react';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import AbsenceFormAdmin from '../../../../Containers/AbsenceForm/AbsenceFormAdmin/AbsenceFormAdmin';
import firebase from 'firebase/app';
import 'firebase/database';
import { getUserAssociatedWithEmail } from '../../../../utils/commonMethods';
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import Modal from '../../../../Components/UI/Modal/Modal';

class AddAbsenceRequestAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            modal: null,
        }

        this.setModalState = this.setModalState.bind(this);
        this.addAbsenceRequestHandler = this.addAbsenceRequestHandler.bind(this);
    }

    addAbsenceRequestHandler(requestDetails, email) {
        getUserAssociatedWithEmail(email)
            .then(employee => {
                let modalDetails;

                if (employee) {
                    requestDetails.employeeId = employee.id;
                    modalDetails = {
                        type: 'warning',
                        content: 'Press OK if you are sure all entered details are correct ',
                        okButtonHandler: () => this.modalConfirmHandler(requestDetails),
                    }
                }
                else {
                    modalDetails = {
                        type: 'error',
                        title: 'email not found!',
                        content: 'Cannot find any employee with this email, please check your input.'
                    }
                }
                this.setModalState(modalDetails);
            })
    }

    modalConfirmHandler(requestDetails) {
        firebase.database().ref('/absence-requests/')
            .push(requestDetails)
            .then(() => {
                return {
                    type: 'success',
                    content: 'The request has been succecssfully added!',
                };
            })
            .catch(() => {
                return {
                    type: 'error',
                };
            })
            .then(modalDetails => {
                this.setModalState(modalDetails);
            })
    }


    setModalState(modalDetails) {
        this.setState({
            isLoading: false,
            modal: {
                key: Math.random(),
                ...modalDetails
            }
        })
    }


    render() {
        return (
            <React.Fragment>
                <PageHeader
                    title="New Absence Request"
                    description="Create an absence request for an employee" />

                <PageMainContainer>
                    <AbsenceFormAdmin action="add" onSubmitHandler={this.addAbsenceRequestHandler} />
                </PageMainContainer>

                {this.state.modal && <Modal key={this.state.modal.key} {...this.state.modal} />}
                {this.state.isLoading && <Spinner />}

            </React.Fragment>
        );
    }
}


export default AddAbsenceRequestAdmin;