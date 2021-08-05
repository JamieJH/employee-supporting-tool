import React, { Component } from 'react';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import AbsenceFormAdmin from '../../../../Containers/AbsenceForm/AbsenceFormAdmin/AbsenceFormAdmin';
import { getUserAssociatedWithId } from '../../../../utils/commonMethods';

import firebase from 'firebase/app';
import 'firebase/database';
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import Modal from '../../../../Components/UI/Modal/Modal';

class AddAbsenceRequestAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestDetails: null,
            modal: null,
        }

        this.setModalState = this.setModalState.bind(this);
        this.editAbsenceRequestHandler = this.editAbsenceRequestHandler.bind(this);
    }

    async componentDidMount() {
        this.setState({
            isLoading: true
        })
        const requestId = this.props.match.params.requestId;
        let requestDetails;
        await firebase.database().ref('/absence-requests/' + requestId)
            .once('value')
            .then(snapshot => {
                requestDetails = snapshot.val();
            })

        // get processor name
        if (requestDetails.processorId) {
            const processor = await getUserAssociatedWithId(requestDetails.processorId);
            requestDetails.processorFullName = processor.fullName;
        }

        console.log(requestDetails);
        const employee = await getUserAssociatedWithId(requestDetails.employeeId);
        requestDetails.employeeEmail = employee.email;
        requestDetails.id = requestId;

        console.log(requestDetails);

        this.setState({
            isLoading: false,
            requestDetails: {
                id: requestId,
                ...requestDetails
            }
        })
    }

    editAbsenceRequestHandler(requestDetails, requestId) {
        this.setState({
            isLoading: true
        })
        const modalDetails = {
            type: 'warning',
            title: 'Are you sure?',
            content: 'Press OK if you are sure all entered details are correct ',
            okButtonHandler: () => this.modalConfirmHandler(requestDetails, requestId),
            cancelMessage: 'Cancel'
        }

        this.setModalState(modalDetails);
    }

    modalConfirmHandler(requestDetails, requestId) {
        this.setState({
            isLoading: true
        })
        firebase.database().ref('/absence-requests/' + requestId)
            .set(requestDetails)
            .then(() => {
                return {
                    type: 'success',
                    title: 'Success!',
                    content: 'The request has been succecssfully updated!',
                    okButtonHandler: () => window.location.reload()
                };
            })
            .catch(() => {
                return {
                    type: 'error',
                    title: 'failed!',
                    content: 'Something went wrong, please try again later',
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
        return this.state.isLoading
            ? <Spinner />
            : (
                <React.Fragment>
                    <PageHeader
                        title="Edit Request"
                        description="Edit absence duration and its status" />

                    <PageMainContainer>
                        <AbsenceFormAdmin
                            action="edit"
                            requestDetails={this.state.requestDetails}
                            onSubmitHandler={this.editAbsenceRequestHandler}
                        />
                    </PageMainContainer>

                    {this.state.modal && <Modal key={this.state.modal.key} {...this.state.modal} />}
                    {this.state.isLoading && <Spinner />}

                </React.Fragment>
            );
    }
}

AddAbsenceRequestAdmin.propTypes = {

}

export default AddAbsenceRequestAdmin;