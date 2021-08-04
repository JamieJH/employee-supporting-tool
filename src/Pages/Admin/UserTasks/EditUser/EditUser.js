import React, { Component } from 'react';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import UserDetailsForm from '../../../../Containers/UserDetailsForm/UserDetailsForm';
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import firebase from 'firebase';
import 'firebase/database';


class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            userDetails: null
        }
    }

    componentDidMount() {
        const userId = this.props.match.params.userId;
        firebase.database().ref('/users/' + userId)
            .once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .then(userDetails => {
                this.setState({
                    isLoading: false,
                    userDetails: {
                        id: userId,
                        ...userDetails
                    }
                })
            })
    }



    render() {
        return this.state.isLoading ? <Spinner /> : (
            <React.Fragment>
                <PageHeader
                    title="User Details"
                    description="Review and/or edit user details." />

                <PageMainContainer >
                    <UserDetailsForm action="edit" location={this.props.location} userDetails={this.state.userDetails} />
                </PageMainContainer>
            </React.Fragment>
        );
    }
}

export default EditUser;