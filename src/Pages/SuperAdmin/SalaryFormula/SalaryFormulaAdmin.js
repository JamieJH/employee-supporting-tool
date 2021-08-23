import React, { useState } from 'react';
import { MainContentLayout } from '../../../Components';
import { openModal, showSpinner } from '../../../redux/actions/actionCreators';
import SalaryFormula from '../../../Containers/SalaryFormulaForms/SalaryFormula';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/database';


const SalaryFormulaAdmin = () => {
	const dispatch = useDispatch();
	const [isInputsDisabled, setIsInputsDisabled] = useState(true);

	const saveEditHandler = (newFormula, employeType) => {
		dispatch(openModal({
			type: 'warning',
			title: 'are you sure?',
			content: `Are you sure you want to change the salary formula for ${employeType.toUpperCase()} employee?`,
			okButtonHandler: () => saveEditConfirmHandler(newFormula, employeType)
		}))
	}

	const toggleInputDisabled = (isDisabled) => {
		setIsInputsDisabled(isDisabled);
	}

	const saveEditConfirmHandler = (newFormula, employeType) => {
		dispatch(showSpinner());
		firebase.database().ref('/salary-formulas').child(employeType).set(newFormula)
			.then(() => {
				dispatch(openModal({
					type: 'success',
					content: `The salary formula for ${employeType.toUpperCase()} has been successfully updated!`
				}))
				toggleInputDisabled(true);
			})
			.catch(() => {
				dispatch(openModal({
					content: `Cannot update salary formula for ${employeType.toUpperCase()} please try again later!`
				}))
			})
	}

	return (
		<MainContentLayout
			title="Salary Formula"
			description="Review, and edit salary formula for each type of employee (Fresher, Probation, and Official)"
			applyMaxWidth={true}>

			<SalaryFormula
				isInputsDisabled={isInputsDisabled}
				toggleInputDisabled={toggleInputDisabled}
				saveEditHandler={saveEditHandler}
			/>

		</MainContentLayout>
	);
}

export default SalaryFormulaAdmin;
