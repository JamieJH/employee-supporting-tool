import React, { Component } from 'react';

import AbsenceFormCommon from '../AbsenceFormInputsCommon/AbsenceFormInputsCommon';

class AbsenceFormEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            generalInfo: null
        }


        this.formSubmitHandler = this.formSubmitHandler.bind(this)
    }

    formSubmitHandler(generalInfo) {
        this.setState({
            employeeEmail: generalInfo.email,
            reason: generalInfo.reason,
            fromDate: generalInfo.fromDate,
            toDate: generalInfo.toDate
        })
    }

    render() {
        console.log(this.state);
        return (
            <React.Fragment>
                <AbsenceFormCommon onSubmit={this.generalInfoFormSubmitHandler} />
            </React.Fragment>
        );
    }
}

export default AbsenceFormEmployee;