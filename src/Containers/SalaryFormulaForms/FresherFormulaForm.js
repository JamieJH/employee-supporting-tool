import React from 'react';
import { Form, Field } from 'react-final-form';
import { SalaryFormulaFormPropTypes } from '../../utils/customPropTypes';

import styles from './SalaryForm.module.css';

const FreshserFormulaForm = (props) => {

	const initialValues = {
		hasExternalIncome: props.formula.hasExternalIncome.netSalary.percentage,
		noExternalIncome: props.formula.noExternalIncome.netSalary.percentage,
	}

	const saveEditHandler = (formData) => {
		const newFormula = JSON.parse(JSON.stringify(props.formula));

		newFormula.hasExternalIncome.netSalary.percentage = formData.hasExternalIncome;
		newFormula.noExternalIncome.netSalary.percentage = formData.noExternalIncome;
		props.saveEditHandler(newFormula);

	}

	const formValidate = (formData) => {
		const errors = {};

		if (!formData.hasExternalIncome) {
			errors.hasExternalIncome = 'Required';
		}

		if (!formData.noExternalIncome) {
			errors.noExternalIncome = 'Required';
		}

		return errors;
	}


	return (
		<Form
			onSubmit={saveEditHandler}
			initialValues={initialValues}
			validate={formValidate}
			render={({ handleSubmit }) => (

				<form className="form" onSubmit={handleSubmit}>
					<Field name='hasExternalIncome'>
						{({ input, meta }) => (
							<div className="formInput">
								<label htmlFor="hasExternalIncome">Net salary (has external income) </label>
								<div className={styles.percentageWithOperationsForm}>
									<input type='number' id="hasExternalIncome" disabled={props.isInputsDisabled} min='0.1' max='1' step='0.001' {...input} />
									<p>x <span className={styles.defaultFields}>{props.formula.hasExternalIncome.netSalary.takenFrom}</span></p>
								</div>
								{meta.touched && meta.error && <span className="fieldError">{meta.error}</span>}
							</div>
						)}
					</Field>

					<Field name='noExternalIncome'>
						{({ input, meta }) => (
							<div className="formInput">
								<label htmlFor="noExternalIncome">Net salary (no external income) </label>
								<div className={styles.percentageWithOperationsForm}>
									<input type='number' id="noExternalIncome" disabled={props.isInputsDisabled} min='0.1' max='1' step='0.001' {...input} />
									<p>x <span className={styles.defaultFields}>{props.formula.hasExternalIncome.netSalary.takenFrom}</span></p>
								</div>
								{meta.touched && meta.error && <span className="fieldError">{meta.error}</span>}
							</div>
						)}
					</Field>

					{props.children}

				</form>

			)}
		/>
	);
}

FreshserFormulaForm.propTypes = SalaryFormulaFormPropTypes;

export default FreshserFormulaForm;