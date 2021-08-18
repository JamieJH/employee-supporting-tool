import React from 'react';
import { Form, Field } from 'react-final-form';
import { SalaryFormulaFormPropTypes } from '../../utils/customPropTypes';

import styles from './SalaryForm.module.css';

const ProbationFormulaForm = (props) => {
	const initialValues = {
		netSalary: props.formula.netSalary.percentage,
	}

	const saveEditHandler = (formData) => {
		const newFormula = JSON.parse(JSON.stringify(props.formula));

		newFormula.netSalary.percentage = formData.netSalary;
		props.saveEditHandler(newFormula);
	}

	const formValidate = (formData) => {
		const errors = {};

		if (formData.netSalary === undefined) {
			errors.netSalary = 'Required';
		}

		return errors;
	}

	return (
		<Form
			onSubmit={saveEditHandler}
			validate={formValidate}
			initialValues={initialValues}
			render={({ handleSubmit }) => (

				<form onSubmit={handleSubmit}>
					<Field name='netSalary'>
						{({ input, meta }) => (
							<div className="formInput">
								<label htmlFor="netSalary">Net salary</label>
								<div className={styles.percentageWithOperationsForm}>
									<input type='number' id="netSalary" min='0' max='1' step='0.001' disabled={props.isInputsDisabled} {...input} />
									<p>x <span className={styles.defaultFields}>{props.formula.netSalary.takenFrom}</span></p>
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

ProbationFormulaForm.propTypes = SalaryFormulaFormPropTypes;

export default ProbationFormulaForm;