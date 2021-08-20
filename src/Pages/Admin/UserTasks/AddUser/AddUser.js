import React from 'react';
import { openModal, showSpinner } from '../../../../redux/actions/actionCreators';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MainContentLayout } from '../../../../Components/index';
import UserDetailsForm from '../../../../Containers/UserDetailsForm/UserDetailsForm';
import { uploadImageAndGetURL } from '../../../../utils/commonMethods'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const AddUser = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const formSubmitHandler = (userDetails, uploadedImageFile) => {
		dispatch(showSpinner());
		addUserHandler(userDetails, uploadedImageFile).then(modalDetails => {
			dispatch(openModal(modalDetails));
		})
	}

	const addUserHandler = async (userDetails, uploadedImageFile) => {
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
					modalDetails.content = 'This Email is associated with another user, try adding a number if you are sure is a different user.';
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
				modalDetails.okButtonHandler = () => history.push('/all-users')
			})
			.catch((_) => {
				modalDetails.content = 'Adding new User failed, please try again later!.';
			})

		return modalDetails;
	}

	return (
		<MainContentLayout
			title="Add New User"
			description="Add a user account for an employee">
			<UserDetailsForm action="add" onSubmitHandler={formSubmitHandler} />
		</MainContentLayout>
	);

}

export default AddUser;