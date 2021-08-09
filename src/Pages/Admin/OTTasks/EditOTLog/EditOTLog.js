import React, { Component } from 'react';
import OTFormAdmin from '../../../../Containers/OTForm/OTFormAdmin';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import Modal from '../../../../Components/UI/Modal/Modal';
import { getUserAssociatedWithId, timestampMsToInputDate } from '../../../../utils/commonMethods';

import firebase from 'firebase/app';
import 'firebase/database';


class EditOTLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            logDetails: null,
            modalDetails: null
        }

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }


    async componentDidMount() {
        let logDetails;
        const logId = this.props.match.params.logId;

        await firebase.database().ref('/ot-logs/' + logId)
            .once('value')
            .then(snapshot => {
                logDetails = snapshot.val();
            })

        logDetails.id = logId;

        const employee = await getUserAssociatedWithId(logDetails.employeeId);
        logDetails.employeeEmail = employee.email;

        if (logDetails.processorId) {
            const processor = await getUserAssociatedWithId(logDetails.processorId);
            logDetails.processorEmail = processor.email;
        }


        this.setState({
            isLoading: false,
            logDetails: {
                id: logId,
                ...logDetails
            }
        })
    }

    getFormInitialValues() {
        if (this.state.logDetails) {
            const editDetails = { ...this.state.logDetails };
            editDetails.date = timestampMsToInputDate(editDetails.date);
            delete editDetails.processorId;
            delete editDetails.employeeId;
            delete editDetails.id;

            return editDetails;
        }
    }

    onSubmitHandler(newLogDetails) {
        this.setState({
            isLoading: true
        })

        const logId = this.state.logDetails.id;

        firebase.database().ref('/ot-logs').child(logId).update(newLogDetails)
            .then(() => {
                this.setState({
                    isLoading: false,
                    modalDetails: {
                        key: Math.random(),
                        type: 'success',
                        content: 'The log has been successfully updated!',
                        okButtonHandler: () => window.location.reload()
                    }
                })
            })
            .catch(() => {
                this.setState({
                    isLoading: false,
                    modalDetails: {
                        key: Math.random(),
                        type: 'error',
                        content: 'Something went'
                    }
                })
            })
    }

    render() {
        return this.state.isLoading
            ? <Spinner />
            : <React.Fragment>
                <PageHeader
                    title="Edit OT Log"
                    description="Make changes to submitted OT logs" />

                <PageMainContainer>
                    <OTFormAdmin
                        action="edit"
                        initialValues={this.getFormInitialValues()}
                        onSubmitHandler={this.onSubmitHandler}
                    />
                </PageMainContainer>

                {this.state.modalDetails && <Modal {...this.state.modalDetails} />}
                {this.state.isLoading && <Spinner />}

            </React.Fragment>
            ;
    }
}

export default EditOTLog;