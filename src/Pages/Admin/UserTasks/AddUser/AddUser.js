import React, { Component } from 'react';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';

import UserDetailsForm from '../../../../Containers/UserDetailsForm/UserDetailsForm';

class AddUser extends Component {

    render() {
        return (
            <React.Fragment>
                <PageHeader
                    title="Add New User"
                    description="Add a user account for an employee" />
                <PageMainContainer >
                    <UserDetailsForm action="add" />
                </PageMainContainer>
            </React.Fragment>
        );
    }
}

export default AddUser;