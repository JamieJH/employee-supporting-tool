import React, { Component } from 'react';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import UserDetailsForm from '../../../../Containers/UserDetailsForm/UserDetailsForm';
import { uploadImageAndGetURL } from '../../../../utils/commonMethods'
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import Modal from '../../../../Components/UI/Modal/Modal';
import firebase from 'firebase';
import 'firebase/database';


class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            userDetails: null
        }

        this.formSubmitHandler = this.formSubmitHandler.bind(this);
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

    async formSubmitHandler(userDetails, uploadedImageFile) {
        this.setState({
            isLoading: true,
        })
        const modalDetails = await this.editUserHandler(userDetails, uploadedImageFile);
        this.setState({
            isLoading: false,
            modal: {
                key: Math.random(),
                ...modalDetails
            }
        })
    }

    async editUserHandler(userDetails, uploadedImageFile) {
        this.setState({
            isLoading: true
        })
        const originalDetails = this.state.userDetails;

        for (let field in userDetails) {
            if (originalDetails[field] && originalDetails[field] === userDetails[field]) {
                delete userDetails[field];
            }
        }
        delete userDetails.password;

        if (Object.keys(userDetails).length === 0 && !uploadedImageFile) {
            return {
                type: 'info',
                title: 'No Changes',
                content: 'You did not make any changes for this user',
            }
        }

        // upload image to firebase and get url
        if (uploadedImageFile) {
            const imageName = userDetails.fullName.replaceAll(' ', '-') + '-' + originalDetails.id;
            const imageURL = await uploadImageAndGetURL(uploadedImageFile, imageName);
            if (imageURL) {
                userDetails.image = imageURL;
            }
            else {
                return {
                    type: 'error',
                    content: 'Upload image failed, please try again later!'
                }
            }
        }

        // update user document
        const modalDetails = await firebase.database().ref('users/' + originalDetails.id)
            .update(userDetails)
            .then(() => {
                return {
                    type: 'success',
                    content: 'User details were successfully updated!',
                    okButtonHandler: () => window.location.reload(),
                }
            })
            .catch(() => {
                return {
                    type: 'error',
                    content: 'Update has failed, please try again later!'
                }
            })

        return modalDetails;
    }

    render() {
        return !this.state.userDetails ? <Spinner /> : (
            <React.Fragment>
                <PageHeader
                    title="User Details"
                    description="Review and/or edit user details." />

                <PageMainContainer >
                    <UserDetailsForm
                        action="edit"
                        userDetails={this.state.userDetails}
                        onSubmitHandler={this.formSubmitHandler} />
                </PageMainContainer>
                {this.state.isLoading && <Spinner />}
                {this.state.modal && <Modal key={this.state.modal.key} {...this.state.modal} />}
            </React.Fragment>

        );
    }
}

export default EditUser;