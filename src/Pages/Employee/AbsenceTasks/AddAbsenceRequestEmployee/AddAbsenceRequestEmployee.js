import React, { Component } from 'react';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import AbsenceFormEmployee from '../../../../Containers/AbsenceForm/AbsenceFormEmployee/AbsenceFormEmployee';
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import Modal from '../../../../Components/UI/Modal/Modal';
import firebase from 'firebase';
import 'firebase/database';

class AddAbsenceRequestEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            modalDetails: null,
        }

        this.formSubmitHandler = this.formSubmitHandler.bind(this);
        this.confirmSubmitHandler = this.confirmSubmitHandler.bind(this);
    }

    formSubmitHandler(requestDetails) {
        const modalDetails = {
            type: 'warning',
            title: 'Are you sure?',
            content: 'This action is irreversible, Continue if all entered inputs are correct.',
            okMessage: 'Continue',
            okButtonHandler: () => this.confirmSubmitHandler(requestDetails),
            cancelMessage: 'Cancel'
        }
        this.setStateModal(modalDetails)
    }

    confirmSubmitHandler(requestDetails) {
        this.setState({
            isLoading: true
        })
        firebase.database().ref('/absence-requests/')
            .push(requestDetails)
            .then(() => {
                return {
                    type: 'success',
                    title: 'Success!',
                    content: 'The request has been succecssfully added!',
                }
            })
            .catch(() => {
                return {
                    type: 'error',
                    title: 'failed!',
                    content: 'Something went wrong, please try again later',
                }
            })
            .then(modalDetails => {
                console.log(modalDetails);
                this.setStateModal(modalDetails)
            })
    }

    setStateModal(modalDetails) {
        this.setState({
            isLoading: false,
            modalDetails: {
                key: Math.random(),
                ...modalDetails
            }
        })
    }

    render() {
        return (
            <React.Fragment >
                <PageHeader
                    title="New Absence Request"
                    description="Submit a request absence for processing." />

                <PageMainContainer>
                    <AbsenceFormEmployee onSubmitHandler={this.formSubmitHandler} />
                </PageMainContainer>

                {this.state.isLoading && <Spinner />}
                {this.state.modalDetails && <Modal key={this.state.modalDetails.key} {...this.state.modalDetails} />}
            </React.Fragment>
        );
    }
}


export default AddAbsenceRequestEmployee;