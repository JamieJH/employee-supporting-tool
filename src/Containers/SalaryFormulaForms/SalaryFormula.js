import React, { useState, useEffect } from 'react';
import FreshserFormulaForm from '../../Containers/SalaryFormulaForms/FresherFormulaForm';
import ProbationFormulaForm from '../../Containers/SalaryFormulaForms/ProbationFormulaForm';
import OfficialFormulaForm from '../../Containers/SalaryFormulaForms/OfficialFormulaForm';
import FunctionButton from '../../Containers/FunctionButton/FunctionButton';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { hideSpinner, showSpinner } from '../../redux/actions/actionCreators';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './SalaryFormula.module.css';

const SalaryFormula = (props) => {

	const [formulas, setFormulas] = useState(null);
	const [FormulaForm, setFormulaForm] = useState(null);
	const [employeType, setEmployeeType] = useState('fresher');

	const currentUserRole = useSelector(state => state.auth.role)

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

		if (props.toggleInputDisabled) {
			props.toggleInputDisabled(true);
		}
	}

	const saveEditHandler = (newFormula) => {
		props.saveEditHandler(newFormula, employeType);
	}

	return formulas && (
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
					isInputsDisabled={currentUserRole !== 'superadmin' || props.isInputsDisabled}
					saveEditHandler={saveEditHandler}>

					{currentUserRole === 'superadmin' &&
						<FunctionButton
							action='edit'
							isInputsDisabled={props.isInputsDisabled}
							enabledInputs={() => props.toggleInputDisabled(false)}
						/>
					}
				</FormulaForm.Component>
			}

		</div>
	);
}

export default SalaryFormula;