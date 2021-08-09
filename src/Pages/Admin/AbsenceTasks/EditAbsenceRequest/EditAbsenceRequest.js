import React, { Component } from 'react';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import AbsenceFormAdmin from '../../../../Containers/AbsenceForm/AbsenceFormAdmin/AbsenceFormAdmin';
import { getUserAssociatedWithId } from '../../../../utils/commonMethods';

import firebase from 'firebase/app';
import 'firebase/database';
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import Modal from '../../../../Components/UI/Modal/Modal';

class EditAbsenceRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            requestDetails: null,
            modal: null,
        }

        this.setModalState = this.setModalState.bind(this);
        this.editAbsenceRequestHandler = this.editAbsenceRequestHandler.bind(this);
    }

    async componentDidMount() {
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

        const employee = await getUserAssociatedWithId(requestDetails.employeeId);
        requestDetails.employeeEmail = employee.email;
        requestDetails.id = requestId;


        this.setState({
            isLoading: false,
            requestDetails: {
                id: requestId,
                ...requestDetails
            }
        })
    }

    editAbsenceRequestHandler(requestDetails, requestId) {
        const modalDetails = {
            type: 'warning',
            content: 'Press OK if you are sure all entered details are correct ',
            okButtonHandler: () => this.modalConfirmHandler(requestDetails, requestId),
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
                    content: 'The request has been succecssfully updated!',
                    okButtonHandler: () => window.location.reload()
                };
            })
            .catch(() => {
                return {
                    type: 'error',
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

EditAbsenceRequest.propTypes = {

}

export default EditAbsenceRequest;