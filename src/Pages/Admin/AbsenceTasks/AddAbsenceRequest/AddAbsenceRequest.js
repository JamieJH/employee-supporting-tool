import React, { Component } from 'react';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import AbsenceFormAdmin from '../../../../Containers/AbsenceForm/AbsenceFormAdmin/AbsenceFormAdmin';


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
                    description="Create an absence request for an employee" />

                <PageMainContainer>
                    <AbsenceFormAdmin action="add" />
                </PageMainContainer>
            </React.Fragment>
        );
    }
}

AddAbsenceRequest.propTypes = {

}

export default AddAbsenceRequest;