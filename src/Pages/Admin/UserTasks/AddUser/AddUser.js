import React, { Component } from 'react';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import UserDetailsForm from '../../../../Containers/UserDetailsForm/UserDetailsForm';
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import Modal from '../../../../Components/UI/Modal/Modal';
import { uploadImageAndGetURL } from '../../../../utils/commonMethods'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

class AddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            modal: null,
        }

        this.formSubmitHandler = this.formSubmitHandler.bind(this);
    }

    async formSubmitHandler(userDetails, uploadedImageFile) {
        this.setState({
            isLoading: true,
        })
        const modalDetails = await this.addUserHandler(userDetails, uploadedImageFile);
        this.setState({
            isLoading: false,
            modal: {
                key: Math.random(),
                ...modalDetails
            }
        })
    }

    async addUserHandler(userDetails, uploadedImageFile) {
        let uid = ''
        const modalDetails = {
            type: 'error'
        }

        // insert user into authentication
        await firebase.auth().createUserWithEmailAndPassword(userDetails.email, userDetails.password)
            .then(response => {
                uid = response.user.uid;
            })
            .catch(error => {
                modalDetails.content = 'Something happened, please try again later!';
                if (error.code === "auth/email-already-in-use") {
                    modalDetails.content = 'This Email is associated with another user, try adding a number if you are sure this is a different user.';
                }
            });

        if (!uid) {
            return modalDetails;
        }


        // upload image to firebase and get url
        if (uploadedImageFile) {
            const imageName = userDetails.fullName.replaceAll(' ', '-') + '-' + uid;
            const imageURL = await uploadImageAndGetURL(uploadedImageFile, imageName);
            if (imageURL) {
                userDetails.image = imageURL;
            }
            else {
                modalDetails.content = 'Upload image failed, please try again later!';
                return modalDetails;
            }
        }

        // insert user obj into database
        delete userDetails.password;
        await firebase.database().ref('/users').child(uid).set(userDetails)
            .then(() => {
                modalDetails.type = 'success';
                modalDetails.content = 'New User added successfully.';
                modalDetails.okButtonHandler = () => window.location.reload();
            })
            .catch((_) => {
                modalDetails.content = 'Adding new User failed, please try again later!.';
            })

        return modalDetails;
    }

    render() {
        return (
            <React.Fragment>
                <PageHeader
                    title="Add New User"
                    description="Add a user account for an employee" />
                <PageMainContainer >
                    <UserDetailsForm action="add" onSubmitHandler={this.formSubmitHandler} />
                </PageMainContainer>

                {this.state.isLoading && <Spinner />}
                {this.state.modal && <Modal key={this.state.modal.key} {...this.state.modal} />}

            </React.Fragment>
        );
    }
}

export default AddUser;