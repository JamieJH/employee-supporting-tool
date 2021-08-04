import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { userDetailsPropTypes } from '../../utils/customPropTypes';
import { timestampMsToInputDate, dateStringToTimestampSecs } from '../../utils/commonMethods';
import Modal from '../../Components/UI/Modal/Modal';
import Spinner from '../../Components/UI/Spinner/Spinner';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

import styles from '../FormStyles.module.css';
import { connect } from 'react-redux';


class UserDetailsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: 'add',
            isEditing: false,
            isLoading: false,
            uploadedImageFile: '',
            uploadedImageSource: '',
            modal: {
                count: 0,
                title: '',
                content: ''
            }
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
        this.imageRef = React.createRef();

        this.addUserHandler = this.addUserHandler.bind(this);
        this.editUserHandler = this.editUserHandler.bind(this);
        this.formSubmitHandler = this.formSubmitHandler.bind(this);
        this.editButtonHandler = this.editButtonHandler.bind(this);
        this.getUserRoleOptions = this.getUserRoleOptions.bind(this);
        this.onImageUploadedHandler = this.onImageUploadedHandler.bind(this);
        this.getImageContainerToDisplay = this.getImageContainerToDisplay.bind(this);
        this.toggleInputDisableAttribute = this.toggleInputDisableAttribute.bind(this);

    }

    componentDidMount() {
        if (this.props.action === "edit") {
            this.toggleInputDisableAttribute(true);
        }
    }

    async formSubmitHandler(e) {
        e.preventDefault();
        this.setState({
            isLoading: true
        })

        let result;

        const userDetails = this.getInputsValues();

        if (this.props.action === "add") {
            const isPasswordValid = this.passwordValidator();
            if (!isPasswordValid) {
                const errorMessage = 'Password must contain at least 8 characters, including alphabetical letters and numbers.'
                this.setModalState('error', 'Invalid Password', errorMessage);
            } else {
                result = await this.addUserHandler(userDetails)
            }
        }
        else {
            result = await this.editUserHandler(userDetails);

            if (result.modal.type === 'success') {
                result.modal.okButtonHandler = () => {
                    this.setState({
                        isEditing: false,
                    })
                    this.toggleInputDisableAttribute(true);
                }
            }
        }

        this.setModalState(result.modal.type, result.modal.title, result.modal.content, result.modal.okButtonHandler);

    }

    async addUserHandler(userDetails) {
        let uid = '';
        let errorMessage;

        // insert user into authentication
        await firebase.auth().createUserWithEmailAndPassword(userDetails.email, userDetails.password)
            .then(response => {
                uid = response.user.uid;
            })
            .catch(error => {
                errorMessage = 'Something happened, please try again later!';
                if (error.code === "auth/email-already-in-use") {
                    errorMessage = 'This Email is associated with another user, try adding a number if you are sure this is a different user.';
                }
            });


        // upload image to firebase and get url
        if (!errorMessage && this.state.uploadedImageFile) {
            const { isSuccessful, result } = await this.uploadImageToHost(this.state.uploadedImageFile, userDetails.fullName, uid);
            if (isSuccessful) {
                userDetails.image = result;
            }
            else {
                errorMessage = result;
            }
        }

        // insert user obj into database
        if (!errorMessage) {
            delete userDetails.password;
            firebase.database().ref('/users').child(uid).set(userDetails)
                .catch((_) => {
                    errorMessage = 'Adding new User failed, please try again later!.';
                })
        }

        const modalType = errorMessage ? 'error' : 'success';
        const modalContent = errorMessage || 'New User added successfully.';
        this.setModalState(modalType, '', modalContent)

        if (!errorMessage) {
            this.formRef.current.querySelectorAll("input").forEach(node => {
                node.value = '';
            })
        }

    }

    async editUserHandler(userDetails) {
        let modal = {};
        const originalDetails = this.props.userDetails;


        for (let field in userDetails) {
            if (originalDetails[field] && originalDetails[field] === userDetails[field]) {
                delete userDetails[field];
            }
        }
        delete userDetails.password;


        if (Object.keys(userDetails).length === 0 && !this.state.uploadedImageFile) {
            modal.type = 'info'
            modal.title = 'No Changes';
            modal.content = 'You did not make any changes for this user';
            return modal
        }

        // upload image to firebase and get url
        if (this.state.uploadedImageFile) {
            const { isSuccessful, result } = await this.uploadImageToHost(this.state.uploadedImageFile, originalDetails.fullName, originalDetails.id);
            if (isSuccessful) {
                userDetails.image = result;
            }
            else {
                modal.type = 'error';
                modal.content = result;
                return modal;
            }
        }

        console.log(userDetails);

        // update user document
        await firebase.database().ref('users/' + originalDetails.id)
            .update(userDetails)
            .catch(() => {
                modal.type = 'error';
                modal.content = 'Update has failed, please try again later!';
            })


        if (!modal.type) {
            return {
                modal: {
                    type: 'success',
                    content: 'User details were successfully updated!',
                },
                updatedFields: userDetails
            }
        }
        return { modal };
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

    async uploadImageToHost(image, userFullName, userId) {
        const storage = firebase.storage();
        const imageName = `${userFullName.replaceAll(" ", "-")}-${userId}.jpg`;
        const uploadImageTask = storage.ref('profile-images/' + imageName).put(image)
        let result;
        let isSuccessful = false;

        await uploadImageTask.then(async () => {
            await storage.ref('profile-images').child(imageName)
                .getDownloadURL()
                .then(url => {
                    console.log(url);
                    isSuccessful = true;
                    result = url;
                })
        }).catch(error => {
            console.log(error);
            result = 'Image uploading failed, try again later, or create the user then add a profile image some other time.';
        })

        return { isSuccessful, result };
    }


    toggleInputDisableAttribute(isDisable) {
        if (isDisable) {
            this.formRef.current.querySelectorAll("input, select").forEach(input => {
                input.setAttribute("disabled", true);
            })
        }
        else {
            this.formRef.current.querySelectorAll("input:not(#email, #password), select").forEach(input => {
                if (input.id !== "email") {
                    input.removeAttribute("disabled");
                }
            })
        }
    }

    editButtonHandler(e) {
        e.target.innerText = this.state.isEditing ? "Edit" : "Cancel";
        this.toggleInputDisableAttribute(this.state.isEditing);
        this.setState(state => {
            return {
                isEditing: !state.isEditing
            }
        })
    }

    onImageUploadedHandler(e) {
        if (e.target.files && e.target.files[0]) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.setState({
                    uploadedImageFile: e.target.files[0],
                    uploadedImageSource: fileReader.result
                });
            }
            fileReader.readAsDataURL(e.target.files[0]);
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

    setModalState(type, title, content, okButtonHandler = '') {
        this.setState(state => {
            return {
                isLoading: false,
                modal: {
                    count: state.modal.count + 1,
                    type: type,
                    title: title,
                    content: content,
                    okButtonHandler: () => okButtonHandler()
                }
            }
        })
    }

    getModalToDisplay() {
        return this.state.modal.count !== 0 &&
            <Modal
                key={this.state.modal.count}
                type={this.state.modal.type}
                title={this.state.modal.title}
                content={this.state.modal.content}
                okMessage="OK"
                okButtonHandler={this.state.modal.okButtonHandler}
            />
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


    render() {
        console.log(this.props);
        return (
            <div className={styles.formContainer}>
                {this.props.action === "edit" &&
                    <button className={styles.editButton} onClick={this.editButtonHandler}>Edit</button>}
                <form onSubmit={this.formSubmitHandler} ref={this.formRef}>
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
                        <label htmlFor="profile-image">Profile Image</label>
                        <input type="file" id="profile-image"
                            className={styles.fileInput}
                            ref={this.imageRef}
                            onChange={this.onImageUploadedHandler}
                        />
                        <div className={styles.imageUploader}>
                            <span><i className="fas fa-upload"></i></span>
                            <div>
                                <p>Upload Image</p>
                                <p>JPG or PNG. Max size of 1MB</p>
                            </div>
                        </div>
                        {this.getImageContainerToDisplay()}
                    </div>

                    {(this.state.isEditing || this.props.action === "add")
                        ? <div className={styles.buttons}>
                            <button type="submit" className={styles.saveButton}>Save</button>
                        </div>
                        : ''}
                </form>

                {this.getModalToDisplay()}
                {this.state.isLoading ? <Spinner /> : ''}
            </div>
        );
    }
}


UserDetailsForm.propTypes = {
    action: PropTypes.string,
    role: PropTypes.oneOf(["admin", "superadmin"]),
    location: PropTypes.object,
    userDetails: userDetailsPropTypes

}


const mapStateToProp = (state) => {
    return {

        role: state.auth.role
    }
}

export default connect(mapStateToProp, null)(UserDetailsForm);