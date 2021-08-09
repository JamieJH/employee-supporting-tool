import React, { Component } from 'react';
import uuid from 'uuid-random';
import { connect } from 'react-redux';
import OTFormAdmin from '../../../../Containers/OTForm/OTFormAdmin';
import { uploadFilesToHost, saveOTLogDetails } from '../../../../Containers/OTForm/OTForm';
import { getUserAssociatedWithEmail } from '../../../../utils/commonMethods';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import Modal from '../../../../Components/UI/Modal/Modal';

class LogOTEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            modalDetails: null
        }

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.initialValues = {
            status: 'pending',
            processorEmail: this.props.processorEmail
        }
    }


    async onSubmitHandler(logDetails, files) {
        this.setState({
            isLoading: true
        })

        const otLogId = uuid();
        const employee = await getUserAssociatedWithEmail(logDetails.employeeEmail);
        
        if (!employee) {
            this.setState({
                isLoading: false,
                modalDetails: {
                    key: Math.random(),
                    type: 'error',
                    title: 'User not found',
                    content: "There's no user associated with their email"
                }
            })
            return;
        }

        delete logDetails.employeeEmail;
        delete logDetails.processor;
        logDetails.employeeId = employee.id;
        logDetails.processorId = this.props.processorId;


        if (files) {
            const uploadResults = await uploadFilesToHost(otLogId, files);

            if (uploadResults.isSuccessful) {
                logDetails.files = uploadResults.files;
            }
            else {
                this.setState({
                    isLoading: false,
                    modalDetails: uploadResults.modalDetails
                })
                return;
            }
        }

        const saveDetailsResults = await saveOTLogDetails(otLogId, logDetails);

        this.setState({
            isLoading: false,
            modalDetails: saveDetailsResults.modalDetails
        })

    }

    render() {
        return (
            <React.Fragment >
                <PageHeader
                    title="Log OT"
                    description="Log OT work for an employee." />

                <PageMainContainer>
                    <OTFormAdmin
                        action="add"
                        initialValues={this.initialValues}
                        onSubmitHandler={this.onSubmitHandler} />
                </PageMainContainer>

                {this.state.isLoading && <Spinner />}
                {this.state.modalDetails && <Modal {...this.state.modalDetails} />}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        processorId: state.auth.userId,
        processorEmail: state.auth.userDetails.email
    }
}

export default connect(mapStateToProps, null)(LogOTEmployee);