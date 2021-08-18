import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import FunctionButton from '../../FunctionButton/FunctionButton';

const AbsenceFormEmployee = (props) => {

	const [formDetails, setFormDetails] = useState({
		reason: '',
		toDate: '',
		fromDate: '',
		status: 'pending'
	});

	const employeeId = useSelector(state => state.auth.userId);
	const todayDate = new Date().toISOString().split("T")[0];


	const formSubmitHandler = (e) => {
		e.preventDefault();
		const requestDetails = { ...formDetails };
		requestDetails.employeeId = employeeId;
		props.onSubmitHandler(requestDetails);
	}

	const onInputChange = (e) => {
		e.persist();
		setFormDetails(prevDetails => {
			return {
				...prevDetails,
				[e.target.name]: e.target.value
			}
		})
	}

	return (
		<React.Fragment>
			<form onSubmit={formSubmitHandler} className="form" >
				<div className="formInput">
					<label htmlFor="reason">Reason</label>
					<input type="text" id="reason" name="reason"
						value={formDetails.reason}
						placeholder="Example: high fever, got in accident and now in hospital,..."
						onChange={onInputChange}
						required
					/>
				</div>
				<div className="formInput">
					<label htmlFor="fromDate">From </label>
					<input type="date" id="fromDate" name="fromDate"
						value={formDetails.fromDate}
						min={todayDate}
						max={formDetails.toDate}
						onChange={onInputChange}
						required
					/>
				</div>
				<div className="formInput">
					<label htmlFor="toDate">To</label>
					<input type="date" id="toDate" name="toDate"
						value={formDetails.toDate}
						min={formDetails.fromDate}
						onChange={onInputChange}
						required
					/>
				</div>

				<FunctionButton action='add' />
			</form>
		</React.Fragment>
	);

}


export default AbsenceFormEmployee;