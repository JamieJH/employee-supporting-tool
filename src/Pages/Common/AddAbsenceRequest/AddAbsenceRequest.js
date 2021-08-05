import React, { Component } from 'react';
import AddAbsenceRequestEmployee from '../../Employee/AddAbsenceRequestEmployee/AddAbsenceRequestEmployee';
import AddAbsenceRequestAdmin from '../../Admin/AbsenceTasks/AddAbsenceRequest/AddAbsenceRequest';
import { connect } from 'react-redux';

class AddAbsenceRequest extends Component {
    
    render() { 
        return this.props.role === "employee" 
            ? <AddAbsenceRequestEmployee />
            : <AddAbsenceRequestAdmin action="add" />;
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.auth.role
    }
}
 
export default connect(mapStateToProps, null)(AddAbsenceRequest);