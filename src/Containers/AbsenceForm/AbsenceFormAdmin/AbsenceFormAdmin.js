import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import FunctionButton from '../../FunctionButton/FunctionButton';
import PropTypes from 'prop-types';

const AbsenceFormAdmin = (props) => {
	const processorId = useSelector(state => state.auth.userId);
	const processorEmail = useSelector(state => state.auth.userDetails.email);
	const [isInputsDisabled, setIsInputDisabled] = useState(false);
	const [formErrors, setFormErrors] = useState({});
	const [formDetails, setFormDetails] = useState(props.requestDetails || {
		employeeEmail: '',
		reason: '',
		fromDate: '',
		toDate: '',
		status: 'pending',
		processorId: processorId,
		processorComment: ''
	});

	useEffect(() => {
		if (props.action === "edit") {
			setIsInputDisabled(true);
		}
	}, [props.action])

	const onInputChange = (e) => {
		e.persist();
		const target = e.target;
		setFormDetails(prevDetails => {
			return {
				...prevDetails,
				[target.name]: target.value
			}
		})
	}


	const formSubmitHandler = (e) => {
		e.preventDefault();
		if (formDetails.employeeEmail === processorEmail && formDetails.status !== 'pending') {
			setFormErrors(prevErrors => {
				return {
					...prevErrors,
					status: 'You cannot Approve/Deny your own request'
				}
			})
		}

		if (formDetails.employeeEmail === processorEmail && formDetails.processorComment) {
			setFormErrors(prevErrors => {
				return {
					...prevErrors,
					processorComment: 'You cannot comment on your own request'
				}
			})
			return;
		}

		setFormErrors({});
		props.onSubmitHandler(formDetails);
	}

	return (
		<React.Fragment>
			<form className="form" onSubmit={formSubmitHandler}>
				<div className="formInput">
					<label htmlFor="email">Employee Email</label>
					<input type="text" id="email" name="employeeEmail"
						value={formDetails.employeeEmail || ''}
						placeholder="lastname.firstname@company.com"
						title="Must be in format emailadress@domain.abc"
						pattern="^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,4}$"
						onChange={onInputChange}
						disabled={props.action === 'edit'}
						required
					/>
				</div>
				<div className="formInput">
					<label htmlFor="reason">Reason</label>
					<textarea type="text" id="reason" name="reason"
						value={formDetails.reason}
						placeholder="Example: high fever, got in accident and now in hospital,..."
						onChange={onInputChange}
						disabled={isInputsDisabled}
						maxLength='250'
						required
					/>
					<p className="inputFootnote">Max 250 characters</p>
				</div>
				<div className="formInput">
					<label htmlFor="fromDate">From </label>
					<input type="date" id="fromDate" name="fromDate"
						value={formDetails.fromDate}
						max={formDetails.toDate}
						onChange={onInputChange}
						disabled={isInputsDisabled}
						required
					/>
				</div>
				<div className="formInput">
					<label htmlFor="toDate">To</label>
					<input type="date" id="toDate" name="toDate"
						value={formDetails.toDate}
						min={formDetails.fromDate}
						onChange={onInputChange}
						disabled={isInputsDisabled}
						required
					/>
				</div>
				<div className="formInput">
					<label htmlFor="status">Status</label>
					<select required id="status" name="status"
						onChange={onInputChange}
						disabled={isInputsDisabled}
						value={formDetails.status}>
						<option value="pending">pending</option>
						<option value="approved">approved</option>
						<option value="denied">denied</option>
					</select>
					<p className="fieldError">{formErrors.status}</p>
				</div>
				
				<div className="formInput">
					<label htmlFor="processorComment">processor comment</label>
					<textarea type="text" id="processorComment" name="processorComment"
						placeholder="Example: reason for denial, encouragement, etc"
						onChange={onInputChange}
						disabled={isInputsDisabled}
						value={formDetails.processorComment}
						maxLength='250'
					/>
					<p className="inputFootnote">Max 250 characters</p>
					<p className="fieldError">{formErrors.processorComment}</p>
				</div>

				<div className="formInput">
					<label htmlFor="processor-id">Processor</label>
					<input type="text" id="processor"
						value={processorEmail}
						readOnly
						required disabled />
					<p className="inputFootnote">
						Adding request or changing its original details will list you as the Processor.
					</p>
				</div>

				<FunctionButton
					action={props.action}
					isInputsDisabled={isInputsDisabled}
					enabledInputs={() => setIsInputDisabled(false)} />
			</form>
		</React.Fragment>
	);

}

AbsenceFormAdmin.propTypes = {
	action: PropTypes.string.isRequired,
	requestDetails: PropTypes.object,
	onSubmitHandler: PropTypes.func.isRequired
};

export default AbsenceFormAdmin;