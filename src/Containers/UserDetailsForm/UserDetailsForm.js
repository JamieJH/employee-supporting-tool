import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { userDetailsPropTypes } from '../../utils/customPropTypes';
import { timestampMsToInputDate, dateStringToTimestampSecs } from '../../utils/commonMethods';

import styles from '../FormStyles.module.css';
import { connect } from 'react-redux';
import FileInput from '../FileInput/FileInput';


class UserDetailsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            uploadedImageFile: '',
            uploadedImageSource: '',
        }

        this.todayDate = new Date().toISOString().split("T")[0];
        this.userDetailsForEditing = this.props.userDetails;

        this.formRef = React.createRef();
        this.fullNameRef = React.createRef();
        this.dobRef = React.createRef();
        this.genderRef = React.createRef();
        this.roleRef = React.createRef();
        this.positionRef = React.createRef();
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.dateStartedRef = React.createRef();

        this.enableEditing = this.enableEditing.bind(this);
        this.formSubmitHandler = this.formSubmitHandler.bind(this);
        this.getUserRoleOptions = this.getUserRoleOptions.bind(this);
        this.onImageUploadedHandler = this.onImageUploadedHandler.bind(this);
        this.getImageContainerToDisplay = this.getImageContainerToDisplay.bind(this);
        this.toggleFormInputsDisabled = this.toggleFormInputsDisabled.bind(this);

    }

    componentDidMount() {
        if (this.props.action === "edit") {
            this.toggleFormInputsDisabled(true);
        }
    }

    formSubmitHandler(e) {
        e.preventDefault();
        const userDetails = this.getInputsValues();

        if (this.props.action === "add") {
            const isPasswordValid = this.passwordValidator();
            if (!isPasswordValid) {
                const errorMessage = 'Password must contain at least 8 characters, including alphabetical letters and numbers.'
                this.setModalState('error', 'Invalid Password', errorMessage);
            }
            else {
                this.props.onSubmitHandler(userDetails, this.state.uploadedImageFile);
            }
        }
        else {
            this.props.onSubmitHandler(userDetails, this.state.uploadedImageFile);
        }

    }


    getInputsValues() {
        return {
            fullName: this.fullNameRef.current.value.toLowerCase(),
            dob: dateStringToTimestampSecs(this.dobRef.current.value),
            gender: this.genderRef.current.value,
            role: this.roleRef.current.value,
            position: this.positionRef.current.value.toLowerCase(),
            email: this.emailRef.current.value.toLowerCase(),
            password: this.passwordRef.current.value,
            dateStarted: dateStringToTimestampSecs(this.dateStartedRef.current.value),
        }
    }


    toggleFormInputsDisabled(isDisable) {
        if (isDisable) {
            this.formRef.current.querySelectorAll("input, select").forEach(input => {
                input.setAttribute("disabled", true);
            })
        }
        else {
            this.formRef.current.querySelectorAll("input:not(#email, #password), select").forEach(input => {
                input.removeAttribute("disabled");
            })
        }
    }

    onImageUploadedHandler(e) {
        const files = e.target.files;
        if (files && files[0]) {
            if (files[0].size > 2 * 1024 * 1024) {
                this.setState({
                    imageError: 'Image too large'
                })
            }
            else {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    this.setState({
                        imageError: '',
                        uploadedImageFile: files[0],
                        uploadedImageSource: fileReader.result
                    });
                }
                fileReader.readAsDataURL(files[0]);
            }
        }
    }

    getImageContainerToDisplay() {
        let imageSource = '';
        if (this.state.uploadedImageSource) {
            imageSource = this.state.uploadedImageSource;
        }
        else if (this.props.userDetails && this.props.userDetails.image) {
            imageSource = this.props.userDetails.image
        }

        return imageSource &&
            <div className={styles.imageContainer}>
                <img src={imageSource} alt="user uploaded profile" />
            </div>
    }

    getUserRoleOptions() {
        if (this.props.role === "admin") {
            return ["employee"];
        }
        else {
            return ["employee", "admin", "superadmin"];
        }
    }

    passwordValidator() {
        const enteredPassword = this.passwordRef.current.value;
        const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
        return regex.test(enteredPassword);
    }

    enableEditing(e) {
        e.preventDefault();
        this.setState({
            isEditing: true
        })
        this.toggleFormInputsDisabled(false);
    }

    getFunctionButton() {
        if (this.props.action === 'add' || this.state.isEditing) {
            return <button type="submit" className={styles.saveButton}>Save</button>
        }
        else {
            return <button type="button" onClick={this.enableEditing} className={styles.editButton}>Edit</button>
        }
    }



    render() {
        console.log(this.state);
        return (
            <React.Fragment>
                <form onSubmit={this.formSubmitHandler} className={styles.form} ref={this.formRef}>
                    <div className={styles.formInput}>
                        <label htmlFor="full-name">Full Name</label>
                        <input type="text" id="full-name"
                            defaultValue={this.userDetailsForEditing ? this.userDetailsForEditing.fullName : ''}
                            placeholder="Example: John Smith, Jane Black-Smith, Dylan O'Brien"
                            pattern="^([a-zA-Z]+)\s([a-zA-Z]+)((-|')([a-zA-Z]+))*$"
                            title="First name and last name only. Contains alphabet letters, a hyphen and apostrophe"
                            ref={this.fullNameRef}
                            required
                        />
                    </div>
                    <div className={styles.formInput}>
                        <label htmlFor="dob">Date of Birth</label>
                        <input type="date" id="dob"
                            defaultValue={this.userDetailsForEditing ? timestampMsToInputDate(this.userDetailsForEditing.dob) : ''}
                            max={this.todayDate}
                            placeholder="dd/mm/yyyy"
                            ref={this.dobRef}
                            required
                        />
                    </div>
                    <div className={styles.formInput}>
                        <label htmlFor="gender">Gender</label>
                        <select required ref={this.genderRef} id="gender"
                            defaultValue={this.userDetailsForEditing ? this.userDetailsForEditing.gender : ''}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className={styles.formInput}>
                        <label htmlFor="user-role">User Role</label>
                        <select required ref={this.roleRef} id="user-role"
                            defaultValue={this.userDetailsForEditing ? this.userDetailsForEditing.role : ''}
                        >
                            {this.getUserRoleOptions().map(option => {
                                return <option key={option} value={option}>{option}</option>
                            })}
                        </select>
                    </div>
                    <div className={styles.formInput}>
                        <label htmlFor="position">Position</label>
                        <input type="text" id="position"
                            defaultValue={this.userDetailsForEditing ? this.userDetailsForEditing.position : ''}
                            placeholder="Example: Undercover Agent, Field Agent,..."
                            ref={this.positionRef}
                            required
                        />
                    </div>
                    <div className={styles.formInput}>
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email"
                            defaultValue={this.userDetailsForEditing ? this.userDetailsForEditing.email : ''}
                            placeholder="lastname.firstname@company.com"
                            title="Must be in format emailadress@domain.abc"
                            pattern="^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                            ref={this.emailRef}
                            required
                        />
                    </div>
                    <div className={styles.formInput}>
                        <label htmlFor="password">Password</label>
                        <input type="text" id="password"
                            placeholder="Make sure you enter the right password before saving."
                            title="Contain at least 8 characters, including alphabetic characters and numbers."
                            ref={this.passwordRef}
                        />
                        <p className={styles.inputFootnote}>
                            At least 8 characters, only alphabetic characters and numbers.
                        </p>
                    </div>
                    <div className={styles.formInput}>
                        <label htmlFor="date-started">Date Started</label>
                        <input type="date" id="date-started"
                            defaultValue={this.userDetailsForEditing ? timestampMsToInputDate(this.userDetailsForEditing.dateStarted) : ''}
                            max={this.todayDate}
                            placeholder="dd/mm/yyyy"
                            ref={this.dateStartedRef}
                            required
                        />
                    </div>
                    <div className={styles.formInput}>
                        <FileInput 
                            accept="image/*"
                            uploadTitle="Upload Image"
                            uploadRules="JPG or PNG. Max size of 2MB"
                            onImageUploadedHandler={this.onImageUploadedHandler}
                        />
                        {this.state.imageError && 
                            <p className={styles.fieldError}>{this.state.imageError}</p>}
                        {this.getImageContainerToDisplay()}
                    </div>

                    {this.props.children}

                    <div className={styles.buttons}>
                        {this.getFunctionButton()}
                    </div>

                </form>
            </React.Fragment>
        );
    }
}


UserDetailsForm.propTypes = {
    action: PropTypes.string.isRequired,
    role: PropTypes.oneOf(["admin", "superadmin"]).isRequired,
    userDetails: userDetailsPropTypes
}


const mapStateToProp = (state) => {
    return {
        role: state.auth.role
    }
}

export default connect(mapStateToProp, null)(UserDetailsForm);