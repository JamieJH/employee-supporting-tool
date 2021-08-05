import React, { Component } from 'react';
import PageHeader from '../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../Components/UI/PageMainContainer/PageMainContainer';
import AbsenceFormEmployee from '../../../Containers/AbsenceForm/AbsenceFormEmployee/AbsenceFormEmployee';


class AddAbsenceRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <PageHeader
                    title="New Absence Request"
                    description="Submit a request absence for processing." />

                <PageMainContainer>
                    <AbsenceFormEmployee />
                </PageMainContainer>
            </React.Fragment>
        );
    }
}

AddAbsenceRequest.propTypes = {

}

export default AddAbsenceRequest;