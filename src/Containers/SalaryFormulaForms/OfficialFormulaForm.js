import React from 'react';
import { Form, Field } from 'react-final-form';
import { camelCaseToRegularString } from '../../utils/commonMethods';
import { SalaryFormulaFormPropTypes } from '../../utils/customPropTypes';

import styles from './SalaryForm.module.css';

const OfficialFormulaForm = (props) => {
	const initialValues = {};

	const displayFieldFromContent = (fieldName) => {
		const fieldFormula = props.formula[fieldName];
		let result = [];

		if (!isNaN(fieldFormula)) {
			return getWholeNumberField(fieldName, fieldFormula);
		}

		if (fieldFormula.min !== undefined) {
			result.push(getWholeNumberField(fieldName + '-min', fieldFormula.min));
		}

		if (fieldFormula.percentage ||
			(fieldFormula.percentage && (fieldFormula.add || fieldFormula.subtract))) {
			result.push(getPercentageWithOperationsField(fieldName));
			return result;
		}

		if (fieldFormula.add) {
			result.push(getAdditionsOrSubtractionsField(fieldName));
			return result;
		}

	}

	const getWholeNumberField = (field, value) => {
		initialValues[field] = value;

		return (
			<Field name={field} key={field}>
				{({ input, meta }) => (
					<div className="formInput">
						<label htmlFor={field}>{camelCaseToRegularString(field)}</label>
						<input type='number' min='0' step='10000' id={field} disabled={props.isInputsDisabled} {...input} />
						{meta.touched && meta.error && <span className="fieldError">{meta.error}</span>}
					</div>
				)}
			</Field>
		)
	}

	const getPercentageWithOperationsField = (fieldName) => {
		const { percentage, takenFrom, add, subtract } = props.formula[fieldName];
		initialValues[fieldName + '-percentage'] = percentage;
		const operation = getAdditionsAndSubtractionsToString({ adders: add, subtractors: subtract });

		return (
			<Field name={fieldName + '-percentage'} key={fieldName}>
				{({ input, meta }) => (
					<div className="formInput">
						<label htmlFor={fieldName}>{camelCaseToRegularString(fieldName)}</label>
						<div className={styles.percentageWithOperationsForm}>
							<input type='number' id={fieldName} min='0' max='1' step='0.001' disabled={props.isInputsDisabled} {...input} />
							<p>x <span className={styles.defaultFields}>{takenFrom}</span></p>
							{operation && <p><span className={styles.defaultFields}>{operation}</span></p>}
						</div>
						{meta.touched && meta.error && <span className="fieldError">{meta.error}</span>}
					</div>
				)}
			</Field>
		)
	}

	const getAdditionsAndSubtractionsToString = ({ adders, subtractors }) => {
		let formula = '';
		if (adders) {
			formula += adders.join(' + ');
		}
		if (subtractors) {
			formula += ' - ' + subtractors.join(' - ');
		}
		return formula;
	}

	const getAdditionsOrSubtractionsField = (field) => {
		const { add: adders, subtract: subtractors } = props.formula[field];
		const formula = getAdditionsAndSubtractionsToString({ adders, subtractors });
		return (
			<div className={styles.formTextField} key={field}>
				<h4>{camelCaseToRegularString(field)}</h4>
				<p> {formula} </p>
			</div>
		)
	}

	const getPersonalIncomeTaxFields = (maxRangeValue) => {
		const { percentage, takenFrom, subtract } = props.formula.personalIncomeTax[maxRangeValue];
		const labelName = isNaN(maxRangeValue) ? maxRangeValue : `Max Taxable income of ${maxRangeValue}`;
		const fieldPercentageName = maxRangeValue + "-percentage";
		const fieldSubtractName = maxRangeValue + "-subtract";
		initialValues[fieldPercentageName] = percentage;
		initialValues[fieldSubtractName] = subtract[0];

		return <div className={styles.personalIncomeTaxFields} key={maxRangeValue}>
			<Field name={fieldPercentageName} key={fieldPercentageName}>
				{({ input, meta }) => (
					<div className="formInput">
						<label htmlFor={fieldPercentageName}>{labelName}</label>
						<div className={styles.percentageWithOperationsForm}>
							<input type='number' id={fieldPercentageName} min='0' max='1' step='0.001' disabled={props.isInputsDisabled} {...input} />
							<p>x <span className={styles.defaultFields}>{takenFrom}</span></p>
						</div>
						{meta.touched && meta.error && <span className="fieldError">{meta.error}</span>}
					</div>
				)}
			</Field>

			<Field name={fieldSubtractName} key={fieldSubtractName}>
				{({ input, meta }) => (
					<div className="formInput">
						<label htmlFor={fieldSubtractName}>subtract by</label>
						<div className={styles.percentageWithOperationsForm}>
							<input type='number' id={fieldSubtractName} min='0' step='10000' disabled={props.isInputsDisabled} {...input} />
						</div>
						{meta.touched && meta.error && <span className="fieldError">{meta.error}</span>}
					</div>
				)}
			</Field>

		</div>
	}

	
	const displayFormulaFieldsInOrder = () => {
		const fieldsOrder = [
			'dependentPersonAllowance', 'lunchAllowance', 'personalAllowance',
			'basicSalary', 'responsibilityAllowances', 'accidentInsurance',
			'healthInsurance', 'socialInsurance', 'responsibilityAllowancesTotal',
			'preTaxIncome', 'taxableIncome'
		];

		return fieldsOrder.map(field => displayFieldFromContent(field));
	}


	const saveEditHandler = (formData) => {
		const newFormula = JSON.parse(JSON.stringify(props.formula))
		Object.keys(formData).forEach(input => {
			const sections = input.split('-');
			if (sections.length === 1) {
				newFormula[input] = formData[input];
			}
			else {
				const [section, subSection] = sections;
				// personal income tax sub-section
				if (!isNaN(section) || section === 'other') {
					if (sections[1] === 'percentage') {
						newFormula.personalIncomeTax[section].percentage = formData[input];
					}
					else {
						newFormula.personalIncomeTax[section].subtract = [formData[input]];
					}
				}
				else {
					newFormula[section][subSection] = formData[input];
				}
			}
		})

		props.saveEditHandler(newFormula);

	}

	const formValidate = (formData) => {
		const errors = {};

		Object.keys(initialValues).forEach(input => {
			if (formData[input] === undefined) {
				errors[input] = 'Required';
			}
		})

		return errors;
	}


	return (
		<Form
			onSubmit={saveEditHandler}
			validate={formValidate}
			initialValues={initialValues}
			render={({ handleSubmit }) => (

				<form className="form" onSubmit={handleSubmit}>
					{displayFormulaFieldsInOrder()}

					<h3>Personal Income Tax Levels</h3>
					{Object.keys(props.formula.personalIncomeTax).map(rangeMaxValue => {
						return getPersonalIncomeTaxFields(rangeMaxValue);
					})}

					{displayFieldFromContent('netSalary')}

					{props.children}
				</form>

			)}
		/>
	);
}

OfficialFormulaForm.propTypes = SalaryFormulaFormPropTypes;

export default OfficialFormulaForm;