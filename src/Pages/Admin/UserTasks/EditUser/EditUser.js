import React, { useState, useEffect } from 'react';
import { hideSpinner, openModal, removeTeamMember, showSpinner } from '../../../../redux/actions/actionCreators';
import { MainContentLayout } from '../../../../Components/index';
import UserDetailsForm from '../../../../Containers/UserDetailsForm/UserDetailsForm';
import { uploadImageAndGetURL } from '../../../../utils/commonMethods'
import firebase from 'firebase/app';
import 'firebase/database';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';


const EditUser = (props) => {
	const [userDetails, setUserDetails] = useState(null);
	const role = useSelector(state => state.auth.role);
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		dispatch(showSpinner());
		const userId = props.match.params.userId;
		firebase.database().ref('/users/' + userId)
			.once('value')
			.then(snapshot => {
				return snapshot.val();
			})
			.then(userDetails => {
				dispatch(hideSpinner());
				setUserDetails({
					id: userId,
					...userDetails
				})
			})
	}, [dispatch, props.match.params.userId])

	const formSubmitHandler = async (newUserDetails, uploadedImageFile) => {
		dispatch(showSpinner())
		const modalDetails = await editUserHandler(newUserDetails, uploadedImageFile);
		dispatch(openModal(modalDetails));
	}

	const editUserHandler = async (newUserDetails, uploadedImageFile) => {
		// remove the fields that was not changed from newUserDetails
		for (let field in newUserDetails) {
			if (userDetails[field] && userDetails[field] === newUserDetails[field]) {
				delete newUserDetails[field];
			}
		}
		delete newUserDetails.password;

		if (Object.keys(newUserDetails).length === 0 && !uploadedImageFile) {
			return {
				type: 'info',
				title: 'No Changes',
				content: 'You did not make any changes for user',
			}
		}

		// upload image to firebase and get url
		if (uploadedImageFile) {
			const imageName = userDetails.fullName.replaceAll(' ', '-') + '-' + userDetails.id;
			const imageURL = await uploadImageAndGetURL(uploadedImageFile, imageName);
			if (!imageURL) {
				return {
					type: 'error',
					content: 'Upload image failed, please try again later!'
				}
			}
			newUserDetails.image = imageURL;
		}

		// update user details in database
		const modalDetails = await firebase.database().ref('users/' + userDetails.id)
			.update(newUserDetails)
			.then(() => {
				return {
					type: 'success',
					content: 'User details were successfully updated!',
					okButtonHandler: () => history.push('/all-users'),
				}
			})
			.catch(() => {
				return {
					content: 'Update has failed, please try again later!'
				}
			})

		// remove team member from current logged in admin if the leader id is changed
		if (role === 'admin' && newUserDetails.leaderId) {
			dispatch(removeTeamMember(userDetails.id));
		}

		return modalDetails;
	}

	return userDetails && (
		<MainContentLayout
			title="User Details"
			description="Review and/or edit user details.">
			<UserDetailsForm
				action="edit"
				userDetails={userDetails}
				onSubmitHandler={formSubmitHandler} />
		</MainContentLayout>
	);
}

export default EditUser;