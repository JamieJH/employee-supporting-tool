import React, { useState, useEffect } from 'react';
import { MainContentLayout, CustomTable } from '../../../../Components';
import {
	getUserAssociatedWithEmail,
	camelCaseToRegularString,
	addCommasToNumber,
	getDateLimitsAsString,
	getOTHoursInTimePeriod,
	getApprovedAbsenceDaysCurrentYear
} from '../../../../utils/commonMethods';
import { useDispatch } from 'react-redux';
import { showSpinner, hideSpinner, openModal } from '../../../../redux/actions/actionCreators';
import FunctionButton from '../../../../Containers/FunctionButton/FunctionButton';
import classNames from 'classnames';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './SalaryPayout.module.css';

const SalaryPayout = () => {
	const thisYear = new Date().getFullYear();
	const previousYear = thisYear - 1;

	const [userDetails, setUserDetails] = useState(null);
	const [salaryFormulas, setSalaryFormula] = useState(null);
	const [finalAmounts, setFinalAmount] = useState(null);
	const [formData, setFormData] = useState({
		email: '',
		year: thisYear,
		isMonth13: false
	})
	const dispatch = useDispatch();
	const calculatedAmounts = {};

	useEffect(() => {
		if (userDetails && salaryFormulas) {
			calculatedAmounts.gross = userDetails.grossSalary;
			const calculateSalaryFromEmployeeType = (employeeType) => {
				const configurations = {
					'fresher': () => {
						return calculateSalaryFresher();
					},
					'probation': () => {
						return calculateSalaryProbation();
					},
					'official': () => {
						return calculateSalaryOfficial();
					}
				}

				return configurations[employeeType]();
			}
			calculateSalaryFromEmployeeType(userDetails.employeeType);
		}

	}, [userDetails, salaryFormulas])



	const calculateSalaryFresher = () => {
		const netSalaryFormula = userDetails.externalSalary
			? salaryFormulas.fresher.hasExternalIncome.netSalary
			: salaryFormulas.fresher.noExternalIncome.netSalary;

		calculatedAmounts.netSalary = calculateFromSubFormula(netSalaryFormula);
		setFinalAmount({ ...calculatedAmounts });
		dispatch(hideSpinner());
	}

	const calculateSalaryProbation = () => {
		calculatedAmounts.netSalary = calculateFromSubFormula(salaryFormulas.probation.netSalary);
		setFinalAmount({ ...calculatedAmounts });
		dispatch(hideSpinner());
	}

	const calculateSalaryOfficial = async () => {
		const formula = salaryFormulas.official;
		const needCalculationAmountsInOrder = [
			"lunchAllowance", "personalAllowance", "basicSalary",
			"responsibilityAllowances", "accidentInsurance", "healthInsurance",
			"socialInsurance", "responsibilityAllowancesTotal",
			"preTaxIncome", "taxableIncome"
		]

		if (!formData.isMonth13) {
			const otHours = await getOTHoursInTimePeriod(userDetails.id);
			calculatedAmounts.overtimeHours = otHours;
			calculatedAmounts.overtimePay = calculatedAmounts.gross / 22 / 8 * otHours;
		}
		else {
			const absenceDays = await getApprovedAbsenceDaysCurrentYear(userDetails.id);
			calculatedAmounts.maxAbsenceDays = userDetails.maxAbsenceDays;
			calculatedAmounts.absenceDaysTaken = absenceDays;
			const bonusPay = (userDetails.maxAbsenceDays - absenceDays) * (calculatedAmounts.gross / 22);
			calculatedAmounts.overtimePay = bonusPay;
		}

		calculatedAmounts.dependentAllowancesTotal = formula.dependentPersonAllowance * userDetails.dependents;

		needCalculationAmountsInOrder.forEach(value => {
			calculatedAmounts[value] = calculateFromSubFormula(formula[value]);
		});

		const personalIncomeTaxRange = Object.keys(formula.personalIncomeTax).find(rangeMax => {
			return calculatedAmounts.taxableIncome <= rangeMax;
		});

		calculatedAmounts.personalIncomeTax = calculateFromSubFormula(formula.personalIncomeTax[personalIncomeTaxRange]);
		calculatedAmounts.netSalary = Math.round(calculateFromSubFormula(formula.netSalary));

		setFinalAmount({ ...calculatedAmounts });
		dispatch(hideSpinner());
	}

	const calculateFromSubFormula = (subFormulaData) => {
		let result = 0;

		if (!isNaN(subFormulaData)) {
			return parseFloat(subFormulaData);
		}

		if (subFormulaData.percentage) {
			result += subFormulaData.percentage * calculatedAmounts[subFormulaData.takenFrom];
		}

		if (subFormulaData.add) {
			result += doAdditionsOrSubtractions(subFormulaData.add, 'add');
		}

		if (subFormulaData.subtract) {
			result += doAdditionsOrSubtractions(subFormulaData.subtract, 'subtract');
		}

		if (subFormulaData.min !== undefined && result < subFormulaData.min) {
			return subFormulaData.min;
		}
		return result
	}

	const doAdditionsOrSubtractions = (values, operator) => {
		const adddtions = values.reduce((accumulated, value) => {
			if (isNaN(value)) {
				return accumulated + calculatedAmounts[value];
			}
			else {
				return accumulated + value;
			}
		}, 0)

		return operator === 'add' ? adddtions : (adddtions * -1);
	}

	const getFinalAmountsToDisplay = () => {
		return Object.keys(finalAmounts).map(section => {
			const title = (finalAmounts.absenceDaysTaken && section === 'overtimePay') ? 'absenceDaysBonus' : section;

			return (
				<tr key={section}>
					<td className={styles.formulaSectionTitle}>{camelCaseToRegularString(title)}</td>
					<td className={styles.formulaSectionAmount}>{addCommasToNumber(Math.round(finalAmounts[section]))}</td>
				</tr>
			)
		})

	}


	const onInputChange = (e) => {
		const target = e.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		setFormData(prevData => {
			return {
				...prevData,
				[target.name]: value
			}
		})
	}


	const formSubmitHandler = async (e) => {
		e.preventDefault();
		dispatch(showSpinner());

		const user = await getUserAssociatedWithEmail(formData.email);
		if (!user) {
			dispatch(openModal({
				content: 'There is no user associated with this email.'
			}));
			return;
		}
		setUserDetails(user);

		// ensure formulas is only fetched once when superadmin calculate payout for many employees
		if (!salaryFormulas) {
			const formulas = await firebase.database().ref('/salary-formulas').once('value')
				.then(snapshot => snapshot.val())
				.catch(() => null)

			if (!formulas) {
				dispatch(openModal({
					content: 'Cannot get salary formulas at this time, try again later!'
				}));
				return;
			}
			setSalaryFormula(formulas);
		}


	}

	const payoutHandler = () => {
		dispatch(openModal({
			type: 'warning',
			title: 'are you sure?',
			content: 'Are you sure you want to confirm payout for '
				+ userDetails.fullName.toUpperCase() + '? This action is irreversible.',
			okButton: 'Yes',
			okButtonHandler: () => confirmPayoutHandler()
		}))
	}

	const confirmPayoutHandler = () => {
		dispatch(showSpinner());

		const { endDate } = getDateLimitsAsString('ot');
		let yearAndMonth = endDate.substr(0, 7);
		const historyData = {
			gross: finalAmounts.gross,
			netSalary: finalAmounts.netSalary
		}

		if (userDetails.employeeType === 'official') {
			if (formData.isMonth13) {
				yearAndMonth = formData.year + "-13";
				historyData.absenceDays = finalAmounts.absenceDaysTaken;
				historyData.absenceDaysBonus = Math.round(finalAmounts.overtimePay);
			}
			else {
				historyData.overtimeHours = finalAmounts.overtimeHours;
				historyData.overtimePay = Math.round(finalAmounts.overtimePay);
			}
		}


		firebase.database().ref('/salary-histories/' + userDetails.id)
			.child(yearAndMonth).set(historyData)
			.then(() => {
				dispatch(openModal({
					type: 'success',
					content: 'The payout has been added to the system'
				}))
			})
			.catch(() => {
				dispatch(openModal({
					type: 'error'
				}))
			})
	}


	return (
		<MainContentLayout
			title="Salary Payout"
			description="Review and confirm monthly salary payout for employees."
			applyMaxWidth={true}>

			<form className={classNames("form", styles.salaryPayoutForm)} onSubmit={formSubmitHandler}>
				<div className="formInput">
					<label htmlFor="email" >Employee Email</label>
					<input type="text" id="email" name='email'
						placeholder="Example: emailaddress@domain.abc"
						pattern="^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,4}$"
						title="Must be in format 'emailaddress@domain.abc'"
						value={formData.email}
						onChange={onInputChange}
						required />
				</div>

				<div className={classNames("formInput", styles.checkboxInput)}>
					<label htmlFor="isMonth13">Calculate for 13th Month Salary (Official Employee only)</label>
					<input type="checkbox" id="isMonth13" name="isMonth13" checked={formData.isMonth13} onChange={onInputChange} />
				</div>

				<div className={classNames("formInput")}>
					<label htmlFor="year">Specific payout year </label>
					<select id="year" name="year" value={formData.year} onChange={onInputChange}>
						<option value={thisYear}>{thisYear}</option>
						<option value={previousYear}>{previousYear}</option>
					</select>
					<p className="inputFootnote">
						Specify the year in which the payout belongs to. Applicable when calculating month 13 payout,
						regular payout will use the system month.
					</p>
					<p className="inputFootnote">
						Because month 13 salary may only be calculated in the following year.
					</p>
				</div>

				<FunctionButton action='add' saveButtonText="Calculate" />
			</form>

			{finalAmounts && (
				<div className={styles.amountTables}>
					<CustomTable>
						<thead>
							<tr>
								<th align="left" className={styles.section}>Section</th>
								<th align="left" className={styles.amount}>Amount</th>
							</tr>
						</thead>
						<tbody>
							{getFinalAmountsToDisplay()}
						</tbody>
					</CustomTable>

					<FunctionButton action='add' saveButtonText="Payout" onClick={payoutHandler} />
				</div>
			)}

		</MainContentLayout>
	);
}

export default SalaryPayout;