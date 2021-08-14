import React, { useState } from 'react';
import OTForm from './OTForm';
import { Field } from 'react-final-form';

import styles from '../FormStyles.module.css';

const OTFormAdmin = (props) => {
	const [isInputsDisabled, setInputsDiabled] = useState(true);

	const onSubmitHandler = (logDetails, files) => {
		const employeeEmail = logDetails.employeeEmail;
		delete logDetails.employeeEmail;
		props.onSubmitHandler(logDetails, employeeEmail, files);
	}

	const getUploadedFilesForEdit = () => {
		const files = props.initialValues.files;
		if (files) {
			return <div className={styles.initialFiles}>
				<h4>Current uploaded Files <i className="fas fa-cloud-download-alt"></i></h4>
				<div className={styles.initialFilesLinks}>
					{files.map((file) => {
						return <a key={file.name} href={file.url} target="_blank" rel="noreferrer">{file.name}</a>
					})}
				</div>
			</div>
		}
	}

	return (
		<React.Fragment >
			<OTForm
				role='admin'
				action={props.action}
				initialValues={props.initialValues}
				onSubmitHandler={onSubmitHandler}
				toggleAdminInputDisabled={setInputsDiabled}
				>
				<Field className={styles.formInput} name="status">
					{({ input }) => (
						<div className={styles.formInput}>
							<label htmlFor="status">status</label>
							<select id="status" disabled={props.action === 'edit' && isInputsDisabled} {...input}>
								<option value="pending">pending</option>
								<option value="approved">approved</option>
								<option value="denied">denied</option>
							</select>
						</div>
					)}
				</Field>
				<Field className={styles.formInput} name="processorComment">
					{({ input }) => (
						<div className={styles.formInput}>
							<label htmlFor="processor-comment">processor comment</label>
							<textarea id="processor-comment" disabled={props.action === 'edit' && isInputsDisabled} {...input} />
						</div>
					)}
				</Field>
				<Field className={styles.formInput} name="processorEmail">
					{({ input }) => (
						<div className={styles.formInput}>
							<label htmlFor="processor-email">processor</label>
							<input type="text" id="processor-email" disabled {...input} />
							<span className={styles.inputFootnote}>
								Adding (or Editing) OT log will make you the latest processor.
							</span>
						</div>
					)}
				</Field>

				{props.action === 'edit' && getUploadedFilesForEdit()}
			</OTForm>
		</React.Fragment>
	);

}

export default OTFormAdmin;