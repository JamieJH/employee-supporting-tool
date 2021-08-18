import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { uploadMultipleFilesAndGetURLs } from '../../utils/commonMethods';
import FileInput from '../FileInput/FileInput';
import firebase from "firebase/app";
import 'firebase/database';
import 'firebase/storage';
import { useRef } from 'react';
import FunctionButton from '../FunctionButton/FunctionButton';


const OTForm = (props) => {
	const [uploadedFiles, setUploadedFiles] = useState(null);
	const [uploadFilesError, setUploadFilesError] = useState(null);
	const [isInputsDisabled, setIsInputDisabled] = useState(false);
	const emailRef = useRef();

	useEffect(() => {
		if (props.action === 'edit') {
			setIsInputDisabled(true);
		}
	}, [props.action])


	const onFileInputChange = (e) => {
		const files = Array.from(e.target.files);

		if (files) {
			if (files.length > 3) {
				setUploadedFiles(null);
				setUploadFilesError('Too many files');
				return;
			}

			for (const file of files) {
				if (file.size > 3 * 1024 * 1024) {
					setUploadedFiles(null);
					setUploadFilesError('File(s) too big');
					return
				}
			}
		}

		setUploadedFiles(files);
		setUploadFilesError('');
	}

	const getUploadedFilesNamesForDisplay = () => {
		if (uploadedFiles) {
			return <div className="uploadedFiles">
				{uploadedFiles.map(file => {
					return <p key={file.size}>{file.name}</p>
				})}
			</div>
		}
	}


	const onSubmit = (formData) => {
		if (!uploadFilesError) {
			const logDetails = {
				date: formData.date,
				fromTime: formData.fromTime,
				duration: formData.duration,
				workSummary: formData.workSummary,
			}

			if (props.role === 'admin') {
				logDetails.employeeEmail = formData.employeeEmail;
				logDetails.status = formData.status;
				logDetails.processorComment = formData.processorComment;
			}
			props.onSubmitHandler(logDetails, uploadedFiles);
		}
	}

	const validateForm = (formData) => {
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
		if (formData.duration === undefined) {
			errors.duration = "Required";
		}
		if (formData.duration === "0") {
			errors.duration = "Must be at least 0.5 hours";
		}
		if (!formData.workSummary) {
			errors.workSummary = "Required";
		}

		return errors;
	}

	const enabledInputs = () => {
		setIsInputDisabled(false);
		if (props.toggleAdminInputDisabled) {
			props.toggleAdminInputDisabled(false);
		}
	}


	return (
		<Form
			onSubmit={onSubmit}
			validate={validateForm}
			initialValues={{ ...props.initialValues }}
			render={({ handleSubmit }) => (
				<form className="form" onSubmit={handleSubmit}>
					<Field name="employeeEmail">
						{({ input, meta }) => (
							<div className="formInput">
								<label htmlFor="employee-email">Employee email</label>
								<input type="text" id="employee-email"
									placeholder="employeeemail@company.com"
									disabled={props.action === 'edit' || props.role === 'employee'}
									ref={emailRef}
									{...input} />
								{meta.touched && meta.error && <span className="fieldError">{meta.error}</span>}
							</div>
						)}
					</Field>
					<Field name="date">
						{({ input, meta }) => (
							<div className="formInput">
								<label htmlFor="date">Date</label>
								<input type="date" id="date" disabled={isInputsDisabled} {...input} />
								{meta.touched && meta.error && <span className="fieldError">{meta.error}</span>}
							</div>
						)}
					</Field>
					<Field name="fromTime">
						{({ input, meta }) => (
							<div className="formInput">
								<label htmlFor="from-time">From (Time)</label>
								<input type="time" id="from-hour" disabled={isInputsDisabled} {...input} />
								{meta.touched && meta.error && <span className="fieldError">{meta.error}</span>}
							</div>
						)}
					</Field>
					<Field name="duration">
						{({ input, meta }) => (
							<div className="formInput">
								<label htmlFor="duration">OT Duration (hours)</label>
								<input type="number" id="duration" min='0.5' step='0.5' disabled={isInputsDisabled} {...input} />
								{meta.touched && meta.error && <span className="fieldError">{meta.error}</span>}
							</div>
						)}
					</Field>
					<Field name="workSummary">
						{({ input, meta }) => (
							<div className="formInput">
								<label htmlFor="work-summary">Work Summary</label>
								<textarea id="work-summary" disabled={isInputsDisabled} {...input} rows="3" />
								{meta.touched && meta.error && <span className="fieldError">{meta.error}</span>}
							</div>
						)}
					</Field>

					{props.children}

					{props.action !== 'edit' &&
						<div className="formInput">
							<FileInput
								uploadTitle="Upload Related files"
								uploadRules="Maximum 3 files and 3MB each.."
								onFileUploadHandler={onFileInputChange}
								multiple
							/>
							<span className="fieldError">{uploadFilesError}</span>
							{getUploadedFilesNamesForDisplay()}
						</div>
					}


					<FunctionButton
						action={props.action}
						isInputsDisabled={isInputsDisabled}
						enabledInputs={enabledInputs} />
				</form>
			)}
		/>
	);

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
}



export default OTForm;