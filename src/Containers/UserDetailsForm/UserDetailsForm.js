import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { userDetailsPropTypes } from '../../utils/customPropTypes';
import FunctionButton from '../FunctionButton/FunctionButton';
import FileInput from '../FileInput/FileInput';

import styles from '../FormStyles.module.css';
import classNames from 'classnames';


const UserDetailsForm = (props) => {
	const [imageError, setImageError] = useState(null);
	const [passwordError, setPasswordError] = useState('');
	const [uploadedImageFile, setUploadedImageFile] = useState(null);
	const [uploadedImageSource, setUploadedImageSource] = useState(null);
	const [formDetails, setFormDetails] = useState(props.userDetails || {
		fullName: '',
		dob: '',
		gender: 'male',
		role: 'employee',
		email: '',
		position: '',
		employeeType: '',
		dateStarted: '',
		password: ''
	});
	const [isInputsDisabled, setIsInputDisabled] = useState(false);
	const role = useSelector(state => state.auth.role);
	const todayDate = new Date().toISOString().split("T")[0];

	useEffect(() => {
		if (props.action === "edit") {
			setIsInputDisabled(true);
		}
	}, [props.action])

	const onInputChange = (e) => {
		setFormDetails(prevDetails => {
			return {
				...prevDetails,
				[e.target.name]: e.target.value
			}
		})
	}

	const formSubmitHandler = (e) => {
		e.preventDefault();
		const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
		const isPasswordValid = regex.test(formDetails.password);

		if (props.action === "add" && !isPasswordValid) {
			setPasswordError('Password must contain at least 8 characters, including alphabetical letters and numbers.');
		}
		else {
			props.onSubmitHandler(formDetails, uploadedImageFile);
		}
	}

	const onImageUploadedHandler = (e) => {
		const files = e.target.files;
		if (files && files[0]) {
			if (files[0].size > 2 * 1024 * 1024) {
				setImageError('Image too large');
			}
			else {
				const fileReader = new FileReader();
				fileReader.onload = () => {
					setImageError('');
					setUploadedImageFile(files[0]);
					setUploadedImageSource(fileReader.result)
				}
				fileReader.readAsDataURL(files[0]);
			}
		}
	}

	const getImageContainerToDisplay = () => {
		let imageSource = '';
		if (uploadedImageSource) {
			imageSource = uploadedImageSource;
		}
		else if (props.userDetails && props.userDetails.image) {
			imageSource = props.userDetails.image
		}

		return imageSource &&
			<div className={styles.imageContainer}>
				<img src={imageSource} alt="user uploaded profile" />
			</div>
	}

	const getUserRoleOptions = () => {
		if (role === "admin") {
			return ["employee"];
		}
		else {
			return ["employee", "admin", "superadmin"];
		}
	}


	return (
		<React.Fragment>
			<form onSubmit={formSubmitHandler} className={styles.form}>
				<div className={styles.formInput}>
					<label htmlFor="full-name">Full Name</label>
					<input type="text" id="full-name" name='fullName'
						value={formDetails.fullName}
						placeholder="Example: Tran Van A, James Dean, ..."
						pattern="^([a-zA-Z]+[ ]?)+$"
						title="First name and last name only. Contains alphabet letters, a hyphen and apostrophe"
						onChange={onInputChange}
						disabled={isInputsDisabled}
						required
					/>
				</div>
				<div className={styles.formInput}>
					<label htmlFor="dob">Date of Birth</label>
					<input type="date" id="dob" name="dob"
						value={formDetails.dob}
						onChange={onInputChange}
						disabled={isInputsDisabled}
						max={todayDate}
						required
					/>
				</div>
				<div className={styles.formInput}>
					<label htmlFor="gender">Gender</label>
					<select required id="gender" name="gender"
						value={formDetails.gender}
						onChange={onInputChange}
						disabled={isInputsDisabled}
					>
						<option value="male">Male</option>
						<option value="female">Female</option>
						<option value="other">Other</option>
					</select>
				</div>
				<div className={styles.formInput}>
					<label htmlFor="employee-type">Employee Type</label>
					<select required id="employee-type" name="employeeType"
						value={formDetails.employeeType}
						onChange={onInputChange}
						disabled={isInputsDisabled}
					>
						{['fresher', 'probation', 'official'].map(option => {
							return <option key={option} value={option}>{option}</option>
						})}
					</select>
				</div>
				<div className={styles.formInput}>
					<label htmlFor="user-role">User Role</label>
					<select required id="user-role" name="role"
						value={formDetails.role}
						onChange={onInputChange}
						disabled={isInputsDisabled}
					>
						{getUserRoleOptions().map(option => {
							return <option key={option} value={option}>{option}</option>
						})}
					</select>
				</div>
				<div className={styles.formInput}>
					<label htmlFor="position">Position</label>
					<input type="text" id="position" name="position"
						value={formDetails.position}
						onChange={onInputChange}
						disabled={isInputsDisabled}
						placeholder="Example: Undercover Agent, Field Agent,..."
						required
					/>
				</div>
				<div className={styles.formInput}>
					<label htmlFor="email">Email</label>
					<input type="text" id="email" name='email'
						value={formDetails.email}
						onChange={onInputChange}
						disabled={props.action === 'edit'}
						placeholder="lastname.firstname@company.com"
						title="Must be in format emailadress@domain.abc"
						pattern="^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,4}$"
						required
					/>
				</div>
				<div className={styles.formInput}>
					<label htmlFor="password">Password</label>
					<input type="text" id="password" name="password"
						value={formDetails.password}
						onChange={onInputChange}
						disabled={props.action === 'edit'}
						placeholder="Make sure you enter the right password before saving."
						title="Contain at least 8 characters, including alphabetic characters and numbers."
					/>
					<p className={styles.inputFootnote}>
						At least 8 characters, only alphabetic characters and numbers.
					</p>
					<p className={styles.fieldError}>{passwordError}</p>
				</div>
				<div className={styles.formInput}>
					<label htmlFor="date-started">Date Started</label>
					<input type="date" id="date-started" name="dateStarted"
						value={formDetails.dateStarted}
						disabled={isInputsDisabled}
						onChange={onInputChange}
						max={todayDate}
						required
					/>
				</div>
				<div className={classNames(styles.formInput, styles.formFileInput)}>
					<FileInput
						accept="image/*"
						uploadTitle="Upload Image"
						uploadRules="JPG or PNG. Max size of 2MB"
						onFileUploadHandler={onImageUploadedHandler}
					/>
					{imageError &&
						<p className={styles.fieldError}>{imageError}</p>}
					{getImageContainerToDisplay()}
				</div>

				{props.children}

				<FunctionButton
					action={props.action}
					isInputsDisabled={isInputsDisabled}
					enabledInputs={() => setIsInputDisabled(false)} />

			</form>
		</React.Fragment>
	);

}


UserDetailsForm.propTypes = {
	action: PropTypes.string.isRequired,
	userDetails: userDetailsPropTypes
}


export default UserDetailsForm;