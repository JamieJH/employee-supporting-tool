import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MainContentLayout, CustomTable } from '../../../Components';
import {
	getUserAssociatedWithEmail,
	camelCaseToRegularString,
	addCommasToNumber,
	getDateLimitsAsString,
	getOTHoursInTimePeriod,
	getApprovedAbsenceDaysCurrentYear
} from '../../../utils/commonMethods';
import { useDispatch } from 'react-redux';
import { showSpinner, hideSpinner, openModal } from '../../../redux/actions/actionCreators';
import FunctionButton from '../../../Containers/FunctionButton/FunctionButton';
import UserEmailSearch from '../../../Containers/UserEmailSearch/UserEmailSearch';
import classNames from 'classnames';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './SalaryPayout.module.css';

const SalaryPayout = () => {
	const thisYear = new Date().getFullYear();
	const previousYear = thisYear - 1;

	const [userDetails, setUserDetails] = useState(null);
	const [isUserFromEmailSearch, setIsUserFromEmailSearch] = useState(false);
	const [finalAmounts, setFinalAmounts] = useState(null);
	const [salaryFormulas, setSalaryFormula] = useState(null);
	const [email, setEmail] = useState('');
	const [formData, setFormData] = useState({
		year: thisYear,
		isMonth13: false
	})
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);
	const dispatch = useDispatch();
	const calculatedAmounts = useRef(null);

	// to check if a user details has been fetched for the current email
	const calculatedUserEmail = useRef(null);

	// dispatch(hideSpinner());

	useEffect(() => {
		firebase.database().ref('/salary-formulas').once('value')
			.then(snapshot => snapshot.val())
			.then(formulas => {
				setSalaryFormula(formulas);
			})
			.catch(() => {
				dispatch(openModal({
					content: 'Cannot get salary formulas at this time, try again later!'
				}));
			})
	}, [dispatch])

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

	const setUserDetailsFromOption = (user) => {
		setUserDetails(user);
		setIsUserFromEmailSearch(true);
	}

	const calculationFormSubmitHandler = async (e) => {
		e.preventDefault();
		dispatch(showSpinner());
		let user = userDetails;

		// only fetch user when the email has changed OR user is not already set from selecting an option from dropdown
		if ((calculatedUserEmail.current && email !== calculatedUserEmail.current)
			|| !isUserFromEmailSearch) {
			user = await getUserAssociatedWithEmail(email);
			if (!user) {
				dispatch(openModal({
					content: 'There is no user associated with this email.'
				}));
				return;
			}
			setUserDetails(user);
			setIsUserFromEmailSearch(false);
		}
		calculatedUserEmail.current = user.email;
		setIsFormSubmitted(true);
	}

	const calculateFromSubFormula = useCallback(
		(subFormulaData) => {
			let result = 0;

			if (!isNaN(subFormulaData)) {
				return parseFloat(subFormulaData);
			}

			if (subFormulaData.percentage) {
				result += subFormulaData.percentage * calculatedAmounts.current[subFormulaData.takenFrom];
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
		}, []
	)

	const calculateSalaryFresher = useCallback(
		() => {
			const netSalaryFormula = userDetails.externalSalary
				? salaryFormulas.fresher.hasExternalIncome.netSalary
				: salaryFormulas.fresher.noExternalIncome.netSalary;

			calculatedAmounts.current.netSalary = calculateFromSubFormula(netSalaryFormula);
			setFinalAmounts({ ...calculatedAmounts.current });
			dispatch(hideSpinner());
		}, [userDetails, dispatch, salaryFormulas, calculateFromSubFormula]
	)

	const calculateSalaryProbation = useCallback(
		() => {
			calculatedAmounts.current.netSalary = calculateFromSubFormula(salaryFormulas.probation.netSalary);
			setFinalAmounts({ ...calculatedAmounts.current });
			dispatch(hideSpinner());
		}, [dispatch, salaryFormulas, calculateFromSubFormula]
	)

	const calculateSalaryOfficial = useCallback(
		async () => {
			const formula = salaryFormulas.official;
			const needCalculationAmountsInOrder = [
				"lunchAllowance", "personalAllowance", "basicSalary",
				"responsibilityAllowances", "accidentInsurance", "healthInsurance",
				"socialInsurance", "responsibilityAllowancesTotal",
				"preTaxIncome", "taxableIncome"
			]

			if (!formData.isMonth13) {
				const otHours = await getOTHoursInTimePeriod(userDetails.id);
				calculatedAmounts.current.overtimeHours = otHours;
				calculatedAmounts.current.overtimePay = calculatedAmounts.current.gross / 22 / 8 * otHours;
			}
			else {
				const absenceDays = await getApprovedAbsenceDaysCurrentYear(userDetails.id);
				calculatedAmounts.current.maxAbsenceDays = userDetails.maxAbsenceDays;
				calculatedAmounts.current.absenceDaysTaken = absenceDays;
				const bonusPay = (userDetails.maxAbsenceDays - absenceDays) * (calculatedAmounts.current.gross / 22);
				calculatedAmounts.current.overtimePay = bonusPay;
			}

			calculatedAmounts.current.dependentAllowancesTotal = formula.dependentPersonAllowance * userDetails.dependents;

			needCalculationAmountsInOrder.forEach(value => {
				calculatedAmounts.current[value] = calculateFromSubFormula(formula[value]);
			});

			const personalIncomeTaxRange = Object.keys(formula.personalIncomeTax).find(rangeMax => {
				return calculatedAmounts.current.taxableIncome <= rangeMax;
			});

			calculatedAmounts.current.personalIncomeTax = calculateFromSubFormula(formula.personalIncomeTax[personalIncomeTaxRange]);
			calculatedAmounts.current.netSalary = Math.round(calculateFromSubFormula(formula.netSalary));

			setFinalAmounts({ ...calculatedAmounts.current });
			dispatch(hideSpinner());
		}, [userDetails, salaryFormulas, formData.isMonth13, dispatch, calculateFromSubFormula]
	)

	// calculate payout when userDetails is available and form is submmitted
	useEffect(() => {
		if (isFormSubmitted && userDetails) {
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

			calculatedAmounts.current = {
				gross: userDetails.grossSalary
			};
			calculateSalaryFromEmployeeType(userDetails.employeeType);
			setIsFormSubmitted(false);
		}
	}, [userDetails, isFormSubmitted, calculateSalaryFresher, calculateSalaryProbation, calculateSalaryOfficial])


	const doAdditionsOrSubtractions = (values, operator) => {
		const adddtions = values.reduce((accumulated, value) => {
			if (isNaN(value)) {
				return accumulated + calculatedAmounts.current[value];
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

	const payoutHandler = async () => {
		const { endDate } = getDateLimitsAsString('month');
		let yearAndMonth = endDate.substr(0, 7);

		// check if a history for this employee is created (firt month payout don't have history)
		const userSalaryHistory = await firebase.database().ref('/salary-histories/' + userDetails.id).once('value')
			.then(snapshot => snapshot.val())

		const modalDetails = {
			key: Math.random(),
			type: 'warning',
			title: 'are you sure?',
			content: 'Are you sure you want to confirm payout for '
				+ userDetails.fullName.toUpperCase() + '? This action is irreversible.',
			okButton: 'Yes',
			okButtonHandler: () => confirmPayoutHandler(yearAndMonth)
		}

		// check if the current month is already paid
		if (userSalaryHistory) {
			await firebase.database().ref('/salary-histories/' + userDetails.id).child(yearAndMonth)
				.once('value')
				.then(snapshot => snapshot.val())
				.then(salary => {
					if (salary) {
						modalDetails.title = 'Already paid!';
						modalDetails.content = 'A payout for this month has already been confirmed for this employee.'
							+ ' Do you want to continue anyway?';
					}
				})
		}

		dispatch(openModal(modalDetails));
	}

	const confirmPayoutHandler = (yearAndMonth) => {
		dispatch(showSpinner());

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

			<form className={classNames("form", styles.salaryPayoutForm)} onSubmit={calculationFormSubmitHandler}>
				<UserEmailSearch
					email={email}
					updateEmail={setEmail}
					onUserEmailSelected={setUserDetailsFromOption} />

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
					<h3>Salary Details for <span>{userDetails.fullName}</span></h3>
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