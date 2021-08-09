import React, { Component } from 'react';
import uuid from 'uuid-random';
import OTForm, { uploadFilesToHost, saveOTLogDetails } from '../../../../Containers/OTForm/OTForm';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import Modal from '../../../../Components/UI/Modal/Modal';
import { connect } from 'react-redux';


class LogOTEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            modalDetails: null
        }

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }


    async onSubmitHandler(logDetails, files) {
        this.setState({
            isLoading: true
        })
        logDetails.employeeId = this.props.employeeId;
        logDetails.status = 'pending';

        const otLogId = uuid();

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
                    description="Log OT work for processing." />

                <PageMainContainer>
                    <OTForm
                        role="employee"
                        onSubmitHandler={this.onSubmitHandler}
                        initialValues={{
                            employeeEmail: this.props.employeeEmail
                        }}/>
                        
                </PageMainContainer>

                {this.state.isLoading && <Spinner />}
                {this.state.modalDetails && <Modal key={Math.random()} {...this.state.modalDetails} />}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        employeeId: state.auth.userId,
        employeeEmail: state.auth.userDetails.employeeEmail
    }
}

export default connect(mapStateToProps, null)(LogOTEmployee);