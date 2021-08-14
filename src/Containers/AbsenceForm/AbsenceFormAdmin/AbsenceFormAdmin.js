import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import FunctionButton from '../../FunctionButton/FunctionButton';

import styles from '../../FormStyles.module.css';

const AbsenceFormAdmin = (props) => {
	const processorId = useSelector(state => state.auth.userId);
	const processorEmail = useSelector(state => state.auth.userDetails.email);
	const [isInputsDisabled, setIsInputDisabled] = useState(false);
	const [formDetails, setFormDetails] = useState(props.requestDetails || {
		employeeEmail: '',
		reason: '',
		fromDate: '',
		toDate: '',
		status: 'pending',
		processorId: processorId,
		processorComment: ''
	});
	console.log(props.requestDetails);

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
		props.onSubmitHandler(formDetails);
	}



	return (
		<React.Fragment>
			<form className={styles.form} onSubmit={formSubmitHandler}>
				<div className={styles.formInput}>
					<label htmlFor="email">Employee Email</label>
					<input type="text" id="email" name="employeeEmail"
						value={formDetails.employeeEmail}
						placeholder="lastname.firstname@company.com"
						title="Must be in format emailadress@domain.abc"
						pattern="^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,4}$"
						onChange={onInputChange}
						disabled={props.action === 'edit'}
						required
					/>
				</div>
				<div className={styles.formInput}>
					<label htmlFor="reason">Reason</label>
					<input type="text" id="reason" name="reason"
						value={formDetails.reason}
						placeholder="Example: high fever, got in accident and now in hospital,..."
						onChange={onInputChange}
						disabled={isInputsDisabled}
						required
					/>
				</div>
				<div className={styles.formInput}>
					<label htmlFor="fromDate">From </label>
					<input type="date" id="fromDate" name="fromDate"
						value={formDetails.fromDate}
						max={formDetails.toDate}
						onChange={onInputChange}
						disabled={isInputsDisabled}
						required
					/>
				</div>
				<div className={styles.formInput}>
					<label htmlFor="toDate">To</label>
					<input type="date" id="toDate" name="toDate"
						value={formDetails.toDate}
						min={formDetails.fromDate}
						onChange={onInputChange}
						disabled={isInputsDisabled}
						required
					/>
				</div>
				<div className={styles.formInput}>
					<label htmlFor="status">Status</label>
					<select required id="status" name="status"
						onChange={onInputChange}
						disabled={isInputsDisabled}
						value={formDetails.status}>
						<option value="pending">pending</option>
						<option value="approved">approved</option>
						<option value="denied">denied</option>
					</select>
				</div>

				<div className={styles.formInput}>
					<label htmlFor="processor-id">Processor</label>
					<input type="text" id="processor"
						value={processorEmail}
						readOnly
						required disabled />
					<p className={styles.inputFootnote}>
						Adding request or changing its original details will list you as the Processor.
					</p>
				</div>
				<div className={styles.formInput}>
					<label htmlFor="processorComment">processor comment</label>
					<input type="text" id="processorComment" name="processorComment"
						placeholder="Example: reason for denial, encouragement, etc"
						onChange={onInputChange}
						disabled={isInputsDisabled}
						value={formDetails.processorComment} />
				</div>

				<FunctionButton
					action={props.action}
					isInputsDisabled={isInputsDisabled}
					enabledInputs={() => setIsInputDisabled(false)} />
			</form>
		</React.Fragment>
	);

}


export default AbsenceFormAdmin;