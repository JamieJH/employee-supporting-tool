import React, { useState, useEffect } from 'react';
import { MainContentLayout } from '../../../../Components';
import FreshserFormulaForm from '../../../../Containers/SalaryFormulaForms/FresherFormulaForm';
import ProbationFormulaForm from '../../../../Containers/SalaryFormulaForms/ProbationFormulaForm';
import OfficialFormulaForm from '../../../../Containers/SalaryFormulaForms/OfficialFormulaForm';
import FunctionButton from '../../../../Containers/FunctionButton/FunctionButton';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { hideSpinner, openModal, showSpinner } from '../../../../redux/actions/actionCreators';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './SalaryFormula.module.css';

const SalaryFormula = () => {

	const [formulas, setFormulas] = useState(null);
	const [FormulaForm, setFormulaForm] = useState(null);
	const [isInputsDisabled, setIsInputsDisabled] = useState(true);
	const [employeType, setEmployeeType] = useState('fresher');

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(showSpinner());
		firebase.database().ref('/salary-formulas').once('value')
			.then(snapshot => {
				return snapshot.val();
			})
			.then(salaryFormulas => {
				setFormulas(salaryFormulas);
				setFormulaForm({
					Component: FreshserFormulaForm,
					formula: salaryFormulas.fresher,
				});
				dispatch(hideSpinner());
			})
	}, [dispatch]);

	const getFormulaToDisplay = (employeeType) => {
		const configurations = {
			'fresher': function () {
				setFormulaForm({
					Component: FreshserFormulaForm,
					formula: formulas.fresher,
				});
			},
			'probation': function () {
				setFormulaForm({
					Component: ProbationFormulaForm,
					formula: formulas.probation,
				});
			},
			'official': function () {
				setFormulaForm({
					Component: OfficialFormulaForm,
					formula: formulas.official,
				});
			}
		}
		return configurations[employeeType]();
	}

	const onEmployeeTypeChange = (e) => {
		const type = e.target.value;
		setEmployeeType(type);
		getFormulaToDisplay(type);
		setIsInputsDisabled(true);
	}

	const saveEditHandler = (newFormula) => {
		console.log(newFormula);
		dispatch(openModal({
			type: 'warning',
			title: 'are you sure?',
			content: `Are you sure you want to change the salary formula for ${employeType.toUpperCase()} employee?`,
			okButtonHandler: () => saveEditConfirmHandler(newFormula)
		}))

	}

	const saveEditConfirmHandler = (newFormula) => {
		dispatch(showSpinner());
		firebase.database().ref('/salary-formulas').child(employeType).set(newFormula)
			.then(() => {
				dispatch(openModal({
					type: 'success',
					content: `The salary formula for ${employeType.toUpperCase()} has been successfully updated!`
				}))
				setIsInputsDisabled(true);
			})
			.catch(() => {
				dispatch(openModal({
					content: `Cannot update salary formula for ${employeType.toUpperCase()} please try again later!`
				}))
			})
	}

	return formulas && (
		<MainContentLayout
			title="Salary Formula"
			description="Review, and edit salary formula for each type of employee (Fresher, Probation, and Official)"
			applyMaxWidth={true}>

			<div className={styles.container}>
				<div className={classNames("formInput", styles.employeeTypeSelect)}>
					<label htmlFor="employeeType">select employee type</label>
					<select id="employeeType" value={employeType} onChange={onEmployeeTypeChange} >
						<option value="fresher">fresher</option>
						<option value="probation">probation</option>
						<option value="official">official</option>
					</select>
				</div>


				<h3>Salary Formula</h3>
				{
					FormulaForm &&
					<FormulaForm.Component
						formula={FormulaForm.formula}
						isInputsDisabled={isInputsDisabled}
						saveEditHandler={saveEditHandler}>

						<FunctionButton
							action='edit'
							isInputsDisabled={isInputsDisabled}
							enabledInputs={() => setIsInputsDisabled(false)}
						/>
					</FormulaForm.Component>
				}

			</div>
		</MainContentLayout>
	);
}

export default SalaryFormula;