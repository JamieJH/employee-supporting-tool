import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { dateStringToTimestampSecs } from '../../utils/commonMethods'
import { uploadMultipleFilesAndGetURLs } from '../../utils/commonMethods';
import styles from '../FormStyles.module.css';
import Modal from '../../Components/UI/Modal/Modal';
import firebase from "firebase/app";
import 'firebase/database';
import 'firebase/storage';

class OTFormEmployee extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalDetails: null,
            uploadedFiles: null,
            uploadFilesError: '',
            uploadedFilesNames: null,
            initialValues: null,
            isEditing: false
        }

        this.formRef = React.createRef();
        this.emailRef = React.createRef();

        this.onSubmit = this.onSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.enableEditing = this.enableEditing.bind(this);
        this.onFileInputChange = this.onFileInputChange.bind(this);

    }

    componentDidMount() {
        if (this.props.role === 'employee') {
            this.emailRef.current.setAttribute('disabled', true);
        }
        if (this.props.role !== 'employee' && this.props.action === 'edit') {
            this.toggleFormInputsDisabled(true);
        }
    }


    checkEnteredTimeValidity(fromTime, toTime) {
        const [fromTimeHour, fromTimeMinute] = fromTime.split(":");
        const [toTimeHour, toTimeMinute] = toTime.split(":");

        return (toTimeHour > fromTimeHour) ||
            (toTimeHour === fromTimeHour && toTimeMinute > fromTimeMinute)
    }

    onFileInputChange(e) {
        const files = Array.from(e.target.files);

        if (files) {
            if (files.length > 3) {
                this.setState({
                    uploadedFiles: null,
                    uploadFilesError: 'Too many files'
                })
                return;
            }

            for (const file of files) {
                if (file.size > 3 * 1024 * 1024) {
                    this.setState({
                        uploadedFiles: null,
                        uploadFilesError: 'File(s) too big'
                    })
                    return
                }
            }
        }

        this.setState({
            uploadFilesError: '',
            uploadedFiles: files
        })
    }

    getUploadedFilesNamesForDisplay() {
        if (this.state.uploadedFiles) {
            return <div className={styles.uploadedFiles}>
                {this.state.uploadedFiles.map(file => {
                    return <p key={file.size}>{file.name}</p>
                })}
            </div>
        }
    }


    onSubmit(formData) {
        const logDetails = {
            date: dateStringToTimestampSecs(formData.date),
            fromTime: formData.fromTime,
            toTime: formData.toTime,
            workSummary: formData.workSummary,
        }


        if (this.props.role === 'admin') {
            logDetails.employeeEmail = formData.employeeEmail;
            logDetails.status = formData.status;
            logDetails.processorComment = formData.processorComment;
        }

        if (!this.state.uploadFilesError) {
            this.setState({
                modalDetails: {
                    key: Math.random(),
                    type: 'warning',
                    content: 'This action is irreversible, only Continue if all entered details are correct.',
                    okButtonHandler: () => this.props.onSubmitHandler(logDetails, this.state.uploadedFiles),
                }
            })
        }
    }

    validateForm(formData) {
        const errors = {};

        if (!formData.employeeEmail) {
            errors.employeeEmail = "Required";
        }

        if (formData.employeeEmail && !formData.employeeEmail.match(/^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
            errors.employeeEmail = "Must be in format emailadress@domain.abc";
        }

        if (!formData.date) {
            errors.date = "Required";
        }
        if (!formData.fromTime) {
            errors.fromTime = "Required";
        }
        if (!formData.toTime) {
            errors.toTime = "Required";
        }
        if (!formData.workSummary) {
            errors.workSummary = "Required";
        }
        if (formData.fromTime && formData.toTime) {
            const isTimeValid = this.checkEnteredTimeValidity(formData.fromTime, formData.toTime);
            if (!isTimeValid) {
                errors.fromTime = "Invalid time period";
                errors.toTime = "Invalid time period";
            }
        }

        return errors;
    }

    toggleFormInputsDisabled(isDisabled) {
        if (isDisabled) {
            this.formRef.current.querySelectorAll('input, select, textarea')
                .forEach(node => node.setAttribute('disabled', true));
        }
        else {
            this.formRef.current.querySelectorAll('input:not(#employee-email, #processor-email), select, textarea')
                .forEach(node => node.removeAttribute('disabled'));

        }
    }

    enableEditing(e) {
        e.preventDefault();
        this.setState({
            isEditing: true
        })
        this.toggleFormInputsDisabled(false);
    }

    getFunctionButton() {
        if (this.props.action === 'edit' && !this.state.isEditing) {
            return <button
                type="button"
                className={styles.editButton}
                onClick={this.enableEditing}>Edit</button>
        }
        else {
            return <button type="submit" className={styles.saveButton}>Submit</button>

        }
    }


    render() {
        return (
            <React.Fragment>
                <Form
                    onSubmit={this.onSubmit}
                    validate={this.validateForm}
                    initialValues={{ ...this.props.initialValues }}
                    render={({ handleSubmit }) => (
                        <form className={styles.form} onSubmit={handleSubmit} ref={this.formRef}>
                            <Field className={styles.formInput} name="employeeEmail">
                                {({ input, meta }) => (
                                    <div className={styles.formInput}>
                                        <label htmlFor="employee-email">Employee email</label>
                                        <input type="text" id="employee-email"
                                            placeholder="employeeemail@company.com"
                                            ref={this.emailRef}
                                            {...input} />
                                        {meta.touched && meta.error && <span className={styles.fieldError}>{meta.error}</span>}
                                    </div>
                                )}
                            </Field>
                            <Field className={styles.formInput} name="date">
                                {({ input, meta }) => (
                                    <div className={styles.formInput}>
                                        <label htmlFor="date">Date</label>
                                        <input type="date" id="date" {...input} />
                                        {meta.touched && meta.error && <span className={styles.fieldError}>{meta.error}</span>}
                                    </div>
                                )}
                            </Field>
                            <Field className={styles.formInput} name="fromTime">
                                {({ input, meta }) => (
                                    <div className={styles.formInput}>
                                        <label htmlFor="from-time">From (Time)</label>
                                        <input type="time" id="from-hour" {...input} />
                                        {meta.touched && meta.error && <span className={styles.fieldError}>{meta.error}</span>}
                                    </div>
                                )}
                            </Field>
                            <Field className={styles.formInput} name="toTime">
                                {({ input, meta }) => (
                                    <div className={styles.formInput}>
                                        <label htmlFor="to-time">To (Time)</label>
                                        <input type="time" id="to-hour" {...input} />
                                        {meta.touched && meta.error && <span className={styles.fieldError}>{meta.error}</span>}
                                    </div>
                                )}
                            </Field>
                            <Field className={styles.formInput} name="workSummary">
                                {({ input, meta }) => (
                                    <div className={styles.formInput}>
                                        <label htmlFor="work-summary">Work Summary</label>
                                        <textarea id="work-summary" {...input} rows="3" />
                                        {meta.touched && meta.error && <span className={styles.fieldError}>{meta.error}</span>}
                                    </div>
                                )}
                            </Field>

                            {this.props.children}

                            {this.props.action !== 'edit' &&
                                <div className={styles.formInput} id="file-uploader-container">
                                    <label htmlFor="related-files">related files (optional)</label>
                                    <input type="file" id="related-files"
                                        className={styles.fileInput}
                                        multiple
                                        onChange={this.onFileInputChange} />
                                    <div className={styles.fileInputUploader}>
                                        <span><i className="fas fa-upload"></i></span>
                                        <div>
                                            <p>Upload Related files</p>
                                            <p>Maximum 3 files and 3MB each..</p>
                                        </div>
                                    </div>
                                    <span className={styles.fieldError}>{this.state.uploadFilesError}</span>
                                </div>
                            }

                            {this.getUploadedFilesNamesForDisplay()}
                            {this.getFunctionButton()}
                        </form>
                    )}
                />
                {this.state.modalDetails && <Modal {...this.state.modalDetails} />}
            </React.Fragment>
        );
    }
}

export const uploadFilesToHost = (logId, files) => {
    let hasError = false;

    const filesNames = files.map((file, index) => {
        const fileType = file.name.split(".")[1];
        return `${logId}-file${index}.${fileType}`;
    })

    return uploadMultipleFilesAndGetURLs(files, filesNames)
        .then(results => {
            console.log(results);
            for (const result of results) {
                if (!result) {
                    hasError = true;
                    break;
                }
            }
            if (!hasError) {
                return {
                    isSuccessful: true,
                    files: results
                };
            }
            else {
                return {
                    isSuccessful: false,
                    modalDetails: {
                        key: Math.random(),
                        type: 'error',
                        content: 'Something went when uploading the files, please try again later',
                    }
                }
            }
        })

}


export const saveOTLogDetails = (logId, logDetails) => {
    return firebase.database().ref('/ot-logs/' + logId).set(logDetails)
        .then(() => {
            return {
                isSuccessful: true,
                modalDetails: {
                    key: Math.random(),
                    type: 'success',
                    title: 'Success!',
                    content: 'OT log details has been successfully saved',
                }
            }
        })
        .catch(() => {
            return {
                isSuccessful: false,
                modalDetails: {
                    key: Math.random(),
                    type: 'error',
                    content: 'Something went wrong, please try again later',
                }
            }
        })
}


const mapStateToProps = (state) => {
    return {
        currentUserEmail: state.auth.userDetails.email,
        currentUserFullName: state.auth.userDetails.fullName
    }
}

export default connect(mapStateToProps, null)(OTFormEmployee);