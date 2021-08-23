import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { userDetailsPropTypes } from '../../utils/customPropTypes';
import FunctionButton from '../FunctionButton/FunctionButton';
import FileInput from '../FileInput/FileInput';
import styles from './UserDetailsForm.module.css';
import classNames from 'classnames';
import firebase from 'firebase/app';
import 'firebase/database';

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
		leaderId: '',
		email: '',
		position: '',
		employeeType: 'fresher',
		dateStarted: '',
		password: '',
		grossSalary: '',
		dependents: 0,
		maxAbsenceDays: 0,
		externalSalary: false
	});
	const [admins, setAdmins] = useState(null);
	const [isInputsDisabled, setIsInputDisabled] = useState(false);
	const [isExternalSalaryDisabled, setIsExternalSalaryDisabled] = useState(false);
	const [isTeamLeaderDisabled, setIsTeamLeaderDisabled] = useState(false);
	const role = useSelector(state => state.auth.role);
	const todayDate = new Date().toISOString().split("T")[0];

	useEffect(() => {
		firebase.database().ref('/users').orderByChild('role').equalTo('admin').once('value')
			.then(snapshot => snapshot.val())
			.then(admins => {
				setAdmins(admins);
			})
	}, [])

	useEffect(() => {
		if (props.action === "edit") {
			setIsInputDisabled(true);
			setIsExternalSalaryDisabled(true);
			setIsTeamLeaderDisabled(true);
		}
	}, [props.action])

	const onInputChange = (e) => {
		setFormDetails(prevDetails => {
			return {
				...prevDetails,
				[e.target.name]: e.target.value
			}
		});
	}

	const onEmployeeTypeChange = (e) => {
		setFormDetails(prevDetails => {
			const newDetails = { ...prevDetails };
			newDetails.employeeType = e.target.value;

			if (e.target.value !== 'fresher') {
				newDetails.externalSalary = false;
				setIsExternalSalaryDisabled(true);
			}
			else {
				setIsExternalSalaryDisabled(false);
			}

			return newDetails;
		});
	}

	const onInputChecboxChange = (e) => {
		e.persist();
		setFormDetails(prevDetails => {
			return {
				...prevDetails,
				externalSalary: e.target.checked
			}
		})
	}

	const onUserRoleChange = (e) => {
		setFormDetails(prevDetails => {
			const newDetails = { ...prevDetails };
			newDetails.role = e.target.value;

			if (e.target.value !== 'employee') {
				newDetails.leaderId = '';
				setIsTeamLeaderDisabled(true);
			}
			else {
				setIsTeamLeaderDisabled(false);
			}

			return newDetails;
		});
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
		const userRoles = (role === "admin")
			? ["employee"]
			: ["employee", "admin", "superadmin"];

		return userRoles.map(option => {
			return <option key={option} value={option}>{option}</option>
		})

	}

	const getTeamLeaderOptions = () => {
		if (admins) {
			return Object.keys(admins).map(userId => {
				return <option key={userId} value={userId}>{admins[userId].email}</option>
			})
		}
	}

	const enableEditing = () => {
		setIsInputDisabled(false);
		if (formDetails.employeeType === 'fresher') {
			setIsExternalSalaryDisabled(false);
		}
		if (formDetails.role === 'employee') {
			setIsTeamLeaderDisabled(false);
		}
	}


	return (
		<React.Fragment>
			<form onSubmit={formSubmitHandler} className="form">
				<h3>General Details</h3>
				<div className="formInput">
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
				<div className="formInput">
					<label htmlFor="dob">Date of Birth</label>
					<input type="date" id="dob" name="dob"
						value={formDetails.dob}
						onChange={onInputChange}
						disabled={isInputsDisabled}
						max={todayDate}
						required
					/>
				</div>
				<div className="formInput">
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
				<div className="formInput">
					<label htmlFor="employee-type">Employee Type</label>
					<select required id="employee-type" name="employeeType"
						value={formDetails.employeeType}
						onChange={onEmployeeTypeChange}
						disabled={isInputsDisabled}
					>
						{['fresher', 'probation', 'official'].map(option => {
							return <option key={option} value={option}>{option}</option>
						})}
					</select>
				</div>
				<div className="formInput">
					<label htmlFor="user-role">User Role</label>
					<select required id="user-role" name="role"
						value={formDetails.role}
						onChange={onUserRoleChange}
						disabled={isInputsDisabled}>
						{getUserRoleOptions()}
					</select>
				</div>
				<div className="formInput">
					<label htmlFor="team-leader">Team Leader</label>
					<select required id="team-leader" name="leaderId" className={styles.teamLeader}
						value={formDetails.leaderId}
						onChange={onInputChange}
						disabled={isTeamLeaderDisabled}>
						<option value=""></option>
						{getTeamLeaderOptions()}
					</select>
					<p className='inputFootnote'>Only avalable for user with role of 'employee'</p>
				</div>
				<div className="formInput">
					<label htmlFor="position">Position</label>
					<input type="text" id="position" name="position"
						value={formDetails.position}
						onChange={onInputChange}
						disabled={isInputsDisabled}
						placeholder="Example: Undercover Agent, Field Agent,..."
						required
					/>
				</div>
				<div className="formInput">
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
				<div className="formInput">
					<label htmlFor="password">Password</label>
					<input type="text" id="password" name="password"
						value={formDetails.password}
						onChange={onInputChange}
						disabled={props.action === 'edit'}
						placeholder="Make sure you enter the right password before saving."
						title="Contain at least 8 characters, including alphabetic characters and numbers."
					/>
					<p className="inputFootnote">
						At least 8 characters, only alphabetic characters and numbers.
					</p>
					<p className="fieldError">{passwordError}</p>
				</div>
				<div className="formInput">
					<label htmlFor="date-started">Date Started</label>
					<input type="date" id="date-started" name="dateStarted"
						value={formDetails.dateStarted}
						disabled={isInputsDisabled}
						onChange={onInputChange}
						max={todayDate}
						required
					/>
				</div>

				<h3>Salary Details</h3>
				<div className="formInput">
					<label htmlFor="monthly-gross">Monthly gross</label>
					<input type="number" id="monthly-gross" name="grossSalary"
						value={formDetails.grossSalary}
						disabled={isInputsDisabled}
						onChange={onInputChange}
						min='0'
						step='100000'
						required
					/>
				</div>
				<div className="formInput">
					<label htmlFor="dependents">Number of dependents</label>
					<input type="number" id="dependents" name="dependents"
						value={formDetails.dependents}
						disabled={isInputsDisabled}
						onChange={onInputChange}
						min='0'
						required
					/>
				</div>
				<div className="formInput">
					<label htmlFor="absence-days">Total absence day per year</label>
					<input type="number" id="absence-days" name="maxAbsenceDays"
						value={formDetails.maxAbsenceDays}
						disabled={isInputsDisabled}
						onChange={onInputChange}
						min='0'
						required
					/>
				</div>
				<div className={classNames("formInput", styles.checkboxInput)}>
					<input type="checkbox" id="external-salary" name="externalSalary"
						checked={formDetails.externalSalary}
						disabled={isExternalSalaryDisabled}
						onChange={onInputChecboxChange}
					/>
					<label htmlFor="external-salary">External Income (for Fresher only)</label>
				</div>

				<div className="formInput formFileInput">
					<FileInput
						accept="image/*"
						uploadTitle="Upload User Profile Image"
						uploadRules="JPG or PNG. Max size of 2MB"
						onFileUploadHandler={onImageUploadedHandler}
					/>
					{imageError &&
						<p className="fieldError">{imageError}</p>}
					{getImageContainerToDisplay()}
				</div>

				<FunctionButton
					action={props.action}
					isInputsDisabled={isInputsDisabled}
					enabledInputs={enableEditing} />

			</form>
		</React.Fragment>
	);

}


UserDetailsForm.propTypes = {
	action: PropTypes.string.isRequired,
	userDetails: userDetailsPropTypes
}


export default UserDetailsForm;